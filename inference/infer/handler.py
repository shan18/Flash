try:
    import unzip_requirements
except ImportError:
    pass

from s3 import fetch_inference_json, fetch_image_classification_model, fetch_text_classification_data
from utils import fetch_post_data, create_response
from image_classification import classify_image
from text_classification import classify_text


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
        if task_config['task_type'] == 'imageclassification':
            model = fetch_image_classification_model(task_config['model_filename'])
            output = classify_image(model, data['input'], task_config['classes'])
        else:
            model_path, model_metadata_path = fetch_text_classification_data(
                task_config['model_filename'],
                task_config['metadata_filename'],
            )
            output = classify_text(
                data['input'], model_path, model_metadata_path
            )

        return create_response({
            'result': 'success',
            'prediction': output,
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
