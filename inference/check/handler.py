try:
    import unzip_requirements
except ImportError:
    pass

import json

from s3 import fetch_status, fetch_inference_json
from utils import fetch_post_data, create_response


def check(event, context):
    try:
        # Fetch data
        data = fetch_post_data(event)
        infer_config = fetch_inference_json()

        # Check if model is currently training
        server_status_config = fetch_status()
        if server_status_config['status'] == 'active' and server_status_config['token'] == data['token']:
            return create_response({
                'result': 'error',
                'message': 'The model is currently training. Please try again after a few minutes.'
            })
        
        # Check if token exists
        if not data['token'] in infer_config:
            return create_response({
                'result': 'error',
                'message': 'No such token found.'
            })

        return create_response({
            'result': 'success',
            'taskType': infer_config[data['token']]['task_type']
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
