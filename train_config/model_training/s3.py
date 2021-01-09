import os
import json
import boto3


# Names
BUCKET_NAME = os.environ.get('S3_BUCKET')

# S3 Connection
S3_CLIENT = boto3.client('s3')
S3_RESOURCE = boto3.resource('s3')
BUCKET = S3_RESOURCE.Bucket(BUCKET_NAME)


def fetch_json(path):
    obj = S3_CLIENT.get_object(
        Bucket=BUCKET_NAME, Key=path
    )
    return json.loads(obj['Body'].read())


def put_object(path, data):
    BUCKET.put_object(
        ContentType='application/json',
        Key=path,
        Body=json.dumps(data, indent=2).encode('utf-8'),
    )


def upload_file(source_path, target_path):
    S3_CLIENT.upload_file(source_path, BUCKET_NAME, target_path)


def delete_object(path):
    S3_RESOURCE.Object(BUCKET_NAME, path).delete()
