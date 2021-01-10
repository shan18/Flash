import os
import io
import json
import boto3
import torch


# Names
BUCKET_NAME = os.environ.get('S3_BUCKET')

# S3 Connection
S3_CLIENT = boto3.client('s3')


def fetch_inference_json():
    print('Fetching inference json')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key='inference.json')
    return json.loads(obj['Body'].read())


def fetch_classification_model(model_path):
    print('Fetching Classification data from S3')
    obj = S3_CLIENT.get_object(Bucket=BUCKET_NAME, Key=model_path)
    bytestream = io.BytesIO(obj['Body'].read())
    return torch.jit.load(bytestream)


def fetch_sa_data(model_path, metadata_path):
    print('Fetching SA data from S3')

    model_data = []
    for path in [model_path, metadata_path]:
        target_path = f'/tmp/{os.path.basename(path)}'
        if not os.path.exists(target_path):
            S3_CLIENT.download_file(BUCKET_NAME, path, target_path)
        model_data.append(target_path)

    return model_data
