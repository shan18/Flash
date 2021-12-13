import os
import io
import json
import boto3


# Names
BUCKET_NAME = os.environ.get('S3_BUCKET')

# S3 Connection
S3_CLIENT = boto3.client('s3')


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return json.loads(obj['Body'].read())


def fetch_url(model_path):
    print('Fetching URL of model S3')
    return f'https://{BUCKET_NAME}.s3.amazonaws.com/{model_path}'
