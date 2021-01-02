import os
import io
import boto3


# Names
BUCKET_NAME = os.environ['S3_BUCKET'] if 'S3_BUCKET' in os.environ else 'loovus'

# S3 Connection
S3_CLIENT = boto3.client('s3')


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return eval(obj['Body'].read())


def fetch_model_data(paths):
    print('Fetching model data from S3')
    if not isinstance(paths, list):
        paths = [paths]
    
    model_data = []
    for path in paths:
        target_path = f'/tmp/{os.path.basename(path)}'
        if not os.path.exists(target_path):
            S3_CLIENT.download_file(BUCKET_NAME, path, target_path)
        model_data.append(target_path)
    
    return model_data if len(model_data) > 1 else model_data[0]
