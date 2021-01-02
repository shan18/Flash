try:
    import unzip_requirements
except ImportError:
    pass

import json

from s3 import fetch_inference_json, fetch_model_data
from utils import fetch_post_data, create_response
from classification import classify
from sentiment_analysis import get_sentiment


def inference(event, context):
    try:
        # Fetch data
        data = fetch_post_data(event)
        infer_config = fetch_inference_json()
        print('post data and inference config fetched')
        
        # Check if token exists
        if not data['token'] in infer_config:
            print(f'Token {data["token"]} not found')
            return create_response({
                'result': 'error',
                'message': 'No such token found.'
            })

        # Make predictions
        task_config = infer_config[data['token']]
        if task_config['task_type'] == 'classification':
            model_path = fetch_model_data(task_config['model_filename'])
            output = classify(model_path, data['input'], task_config['classes'])
        else:
            model_path, model_metadata_path = fetch_model_data([
                task_config['model_filename'],
                task_config['metadata_filename'],
            ])
            output = get_sentiment(
                data['input'], model_path, model_metadata_path
            )

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
