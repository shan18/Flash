import os
import json
import boto3


# Names
BUCKET_NAME = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'loovus'
STATUS_FILE = 'status.json'

# S3 Connection
S3_CLIENT = boto3.client('s3')
S3_RESOURCE = boto3.resource('s3')
BUCKET = S3_RESOURCE.Bucket(BUCKET_NAME)


def fetch_status():
    print('Connecting to S3...')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key=STATUS_FILE)
    return eval(obj['Body'].read())


def change_server_status(new_status, token=None):
    print('Changing training server status')
    BUCKET.put_object(
        ContentType='application/json',
        Key=STATUS_FILE,
        Body=json.dumps({
            'status': new_status,
            'token': '' if token is None else token
        }, indent=2).encode('utf-8'),
    )


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return eval(obj['Body'].read())


def create_training_json(token, data):
    print('Creating training json')
    train_data = {
        'token': token,
        'task_type': data['taskType'].lower(),
        'model': data['modelType'].lower(),
        'batch_size': data['batchSize'],
        'epochs': data['epochs'],
        'data_split': data['dataSplit'],
        'dataset': data['dataset'],
    }

    # Upload data to S3
    BUCKET.put_object(
        ContentType='application/json',
        Key='training/training.json',
        Body=json.dumps(train_data, indent=2).encode('utf-8'),
    )
