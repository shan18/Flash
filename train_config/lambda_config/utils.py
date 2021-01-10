import io
import json
import base64
import string
import random
import pandas as pd
from requests_toolbelt.multipart import decoder

from s3 import fetch_inference_json


def fetch_post_data(event):
    print('Fetching Content-Type')
    if 'Content-Type' in event['headers']:
        content_type_header = event['headers']['Content-Type']
    else:
        content_type_header = event['headers']['content-type']
    print('Loading body...')
    body = base64.b64decode(event['body'])
    print('Body loaded')

    print('Decoding Content')
    decoded = decoder.MultipartDecoder(body, content_type_header).parts[0].text

    return json.loads(decoded)


def create_user_token(task_type, task_name):
    existing_tokens = list(fetch_inference_json().keys())
    base_token = f'{task_type}-{"_".join(task_name.split())}'
    token = f'{base_token}-{"".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(5))}'
    while token in existing_tokens:
        token = f'{base_token}-{"".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(5))}'

    return token


def create_response(body, status_code=200):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': True
        },
        'body': json.dumps(body)
    }


def validate_csv(data):
    df = pd.read_csv(
        io.BytesIO(base64.b64decode(data))
    )

    # Check columns
    columns = list(df.columns)
    if not ('input' in columns or 'label' in columns):
        return {
            'is_valid': False,
            'message': 'Dataset should have two columns with names "input" and "label"',
        }
    elif not 'input' in columns:
        return {
            'is_valid': False,
            'message': 'Dataset does not have a column named "input"',
        }
    elif not 'label' in columns:
        return {
            'is_valid': False,
            'message': 'Dataset does not have a column named "label"',
        }

    # Check column types
    if str(df.input.dtype) != 'object':
        return {
            'is_valid': False,
            'message': 'Input column entries should be of type "string"'
        }

    # Drop invalid rows
    df.dropna(inplace=True)
    df = df[df.input.str.strip().str.len() > 0]
    if str(df.label.dtype) == 'object':
        df = df[df.label.str.strip().str.len() > 0]

    # Check for valid entries
    if len(df) == 0:
        return {
            'is_valid': False,
            'message': 'The dataset contains invalid entries'
        }

    # Check number of classes
    if len(set(df.label)) < 2:
        return {
            'is_valid': False,
            'message': 'The dataset should contain a minimum of two classes',
        }

    # Check number of rows
    if len(df) > 10000:
        return {
            'is_valid': False,
            'message': 'The dataset can contain atmost 10,000 rows',
        }

    return {
        'is_valid': True,
        'data': base64.b64encode(df.to_csv(index=False).encode()).decode(),
        'num_classes': len(set(df.label)),
    }
