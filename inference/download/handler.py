try:
    import unzip_requirements
except ImportError:
    pass

import base64
from s3 import fetch_inference_json, fetch_url
from utils import fetch_post_data, create_response


def download(event, context):
    try:
        # Fetch data
        download_config = fetch_post_data(event)
        infer_config = fetch_inference_json()
        print('post data and inference config fetched')

        # Check if token exists
        if download_config['token'] not in infer_config:
            print(f'Token {download_config["token"]} not found')
            return create_response({
                'result': 'error',
                'message': 'No such token found.'
            })

        # Get model
        task_config = infer_config[download_config['token']]
        if not task_config['downloadable']:
            return create_response({
                'result': 'error',
                'message': 'This model cannot be downloaded.'
            })

        if download_config['format'].lower() == 'pytorch':
            return create_response({
                'result': 'success',
                'url': fetch_url(task_config['model_filename'])
            })
        elif download_config['format'].lower() == 'onnx':
            return create_response({
                'result': 'success',
                'url': fetch_url(task_config['model_filename_onnx'])
            })

        return create_response({
            'result': 'error',
            'message': 'Invalid model format given.'
        })

    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
