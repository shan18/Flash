try:
    import unzip_requirements
except ImportError:
    pass

import json
import string
import random

from s3 import (
    fetch_status,
    fetch_inference_json,
    create_training_json,
    change_server_status,
)
from utils import fetch_post_data, create_user_token, create_response


def status(event, context):
    try:
        return create_response({
            'result': 'success',
            'status': fetch_status()['status'],
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)


def train(event, context):
    try:
        if fetch_status()['status'] == 'active':
            return create_response({
                'result': 'error',
                'message': 'Server is busy.',
            })
        
        # Fetch data
        data = fetch_post_data(event)
        infer_config = fetch_inference_json(
            f'{data["taskType"]}/{data["taskType"]}.json'
        )

        # Create token
        token = create_user_token(
            infer_config, data['taskType'], data['taskName']
        )
        print('Token:', token)

        # Initialize training process
        create_training_json(token, data)

        # Change server status to active
        change_server_status('active', token=token)

        return create_response({
            'result': 'success',
            'token': token
        })
    except Exception as e:
        print(repr(e))
        return create_response({
            'result': 'internal_error',
            'message': repr(e),
        }, status_code=500)
