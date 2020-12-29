try:
    import unzip_requirements
except ImportError:
    pass

import json

from s3 import fetch_inference_json, fetch_model_data
from utils import fetch_post_data, create_response


def inference(event, context):
    try:
        # Fetch data
        data = fetch_post_data(event)
        infer_config = fetch_inference_json()
        
        # Check if token exists
        if not data['token'] in infer_config:
            return create_response({
                'result': 'error',
                'message': 'No such token found.'
            }, status_code=500)

        # Make predictions
        model_data = fetch_model_data(infer_config[data['token']]['model_filename'])
        if infer_config[data['token']]['task_type'] == 'classification':
            model = model_data
            output = 'classification'
        else:
            model, model_meta =  model_data
            output = 'sentiment_analysis'

        return create_response({
            'result': 'success',
            'prediction': output
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
