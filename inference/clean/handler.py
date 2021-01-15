try:
    import unzip_requirements
except ImportError:
    pass

from datetime import datetime

from s3 import fetch_object, delete_object, update_object
from utils import create_response


# Files to be excluded from cleanup
WHITELIST_TOKENS = [
    'classification-tinyimgnet-demo-dbasb',
    'sentimentAnalysis-test-sa-demo-xjfsf'
]

INFERENCE_CONFIG = 'inference.json'


def clean(event, context):
    try:
        # Check if model is currently training
        clean_status_config = fetch_object('cleanup.json')
        if clean_status_config['status'] != 'active':
            print('Status inactive')
            return create_response({
                'result': 'error',
                'message': 'cleanup status is inactive.'
            })

        # Fetch inference data
        infer_config = fetch_object(INFERENCE_CONFIG)

        # Loop through configs
        print('Checking configs')
        safe_objects = {}
        current_time = datetime.now()
        for token, infer_vals in infer_config.items():
            if token not in WHITELIST_TOKENS:
                creation_time = datetime.strptime(infer_vals['created'], '%d-%m-%y %H:%M')
                if (current_time - creation_time).seconds < 7200:  # 2 hours
                    safe_objects[token] = infer_vals
                else:  # Delete objects
                    delete_object(infer_vals['model_filename'])
                    if infer_vals['task_type'] == 'sentimentanalysis':
                        delete_object(infer_vals['metadata_filename'])
                    print('Deleted:', token)
            else:
                safe_objects[token] = infer_vals

        # Update inference json
        update_object(INFERENCE_CONFIG, safe_objects)

        return create_response({
            'result': 'success',
            'message': 'Old objects deleted'
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
