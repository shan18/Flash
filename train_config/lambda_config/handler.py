try:
    import unzip_requirements
except ImportError:
    pass

import os
import boto3

from s3 import (
    fetch_status,
    create_training_json,
    change_server_status,
)
from utils import (
    fetch_post_data,
    create_user_token,
    create_response,
    validate_csv,
)

INSTANCE_ID = os.environ.get('INSTANCE_ID')
REGION = os.environ.get('REGION')

EC2_RESOURCE = boto3.resource('ec2', region_name=REGION)


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
        server_status = fetch_status()
        if server_status['status'] == 'active':
            return create_response({
                'result': 'error',
                'message': 'Server is busy.',
            })

        # Fetch data
        data = fetch_post_data(event)

        # Check if server is properly shutdown
        if EC2_RESOURCE.Instance(INSTANCE_ID).state['Name'] == 'stopping':
            return create_response({
                'result': 'error',
                'message': 'Server is currently training another model, please check back in 5 minutes.'
            })

        # Get number of classes and validate data
        if data['taskType'].lower() == 'textclassification':
            validation_response = validate_csv(data['dataset'])
            if validation_response['is_valid']:
                data['dataset'] = validation_response['data']
                data['numClasses'] = validation_response['num_classes']
            else:
                return create_response({
                    'result': 'error',
                    'message': validation_response['message'],
                })
        else:
            data['numClasses'] = len(data['dataset'])

        # Create token
        token = create_user_token(
            data['taskType'], data['taskName']
        )
        print('Token:', token)

        # Change server status to active
        change_server_status(
            'active', server_status['dev_mode'],
            task_type=data['taskType'].lower(), token=token
        )

        # Initialize training process
        create_training_json(token, data)

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


def server_start(event, context):
    message = 'Status not active. Server not turned on.'

    server_status = fetch_status()
    if server_status['dev_mode']:
        message = 'Dev mode is on.'
    elif server_status['status'] == 'active':
        ec2_client = boto3.client('ec2', region_name=REGION)
        ec2_client.start_instances(InstanceIds=[INSTANCE_ID])
        message = 'Instance started.'

    print(message)
    return create_response({
        'message': message
    })


def server_stop(event, context):
    server_status = fetch_status()
    if server_status['dev_mode']:
        message = 'Dev mode is on.'
    else:
        # Stop instance
        ec2_client = boto3.client('ec2', region_name=REGION)
        ec2_client.stop_instances(InstanceIds=[INSTANCE_ID])
        message = 'Instance stopped.'

        # Change server status
        change_server_status('sleeping', server_status['dev_mode'])

    print(message)
    return create_response({
        'message': message
    })
