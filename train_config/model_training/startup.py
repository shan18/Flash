import os
import boto3
import base64
import json


# Names
BUCKET_NAME = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'loovus'

# S3 Connection
S3_CLIENT = boto3.client('s3')
S3_RESOURCE = boto3.resource('s3')


def fetch_status():
    print('Connecting to S3...')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='status.json')
    return json.loads(obj['Body'].read())


def fetch_training_json():
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='training/training.json')
    return eval(obj['Body'].read())


if __name__ == '__main__':
    if not fetch_status()['dev_mode']:
        train_json = fetch_training_json()
        if isinstance(train_json['dataset'], str):
            data = base64.b64decode(train_json['dataset'])
            with open('/home/ubuntu/a.csv', 'wb') as f:
                f.write(data)
        S3_CLIENT.upload_file('/home/ubuntu/a.csv', BUCKET_NAME, 'a.csv')
        os.remove('/home/ubuntu/a.csv')
        S3_RESOURCE.Object('loovus', 'training/training.json').delete()
