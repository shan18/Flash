import os
import boto3


# Names
BUCKET_NAME = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'loovus'

# S3 Connection
S3_CLIENT = boto3.client('s3')


def fetch_status():
    print('Connecting to S3...')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='status.json')
    return eval(obj['Body'].read())


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return eval(obj['Body'].read())
