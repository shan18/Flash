import os
import json
import boto3


# Names
BUCKET_NAME = os.environ.get('S3_BUCKET')
STATUS_FILE = 'status.json'

# S3 Connection
S3_CLIENT = boto3.client('s3')
S3_RESOURCE = boto3.resource('s3')
BUCKET = S3_RESOURCE.Bucket(BUCKET_NAME)


def fetch_status():
    print('Connecting to S3...')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key=STATUS_FILE)
    return json.loads(obj['Body'].read())


def change_server_status(new_status, dev_mode, token=None):
    print('Changing training server status')
    BUCKET.put_object(
        ContentType='application/json',
        Key=STATUS_FILE,
        Body=json.dumps({
            'status': new_status,
            'token': '' if token is None else token,
            'dev_mode': dev_mode,
        }, indent=2).encode('utf-8'),
    )


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return json.loads(obj['Body'].read())


def create_training_json(token, data):
    print('Creating training json')
    train_data = {
        'token': token,
        'task_type': data['taskType'].lower(),
        'num_classes': int(data['numClasses']),
        'optimizer': data['optimizer'].lower(),
        'learning_rate': float(data['learningRate']),
        'batch_size': int(data['batchSize']),
        'epochs': int(data['epochs']),
        'data_split': data['dataSplit'],
        'dataset': data['dataset'],
        'model': data['modelType'].lower(),
        'reduce_lr_on_plateau': {
            'factor': float(data['reduceLrOnPlateauFactor']),
            'patience': int(data['reduceLrOnPlateauPatience']),
            'min_lr': float(data['reduceLrOnPlateauMinLr']),
        } if data['reduceLrOnPlateau'] else False,
    }

    # Upload data to S3
    BUCKET.put_object(
        ContentType='application/json',
        Key='training/training.json',
        Body=json.dumps(train_data, indent=2).encode('utf-8'),
    )
