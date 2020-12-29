import json
import base64
import string
import random
from datetime import datetime
from requests_toolbelt.multipart import decoder


TIME_FORMAT = '%d-%m-%y %H:%M'


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


def create_user_token(infer_config, task_type, task_name):
    existing_tokens = list(infer_config.keys())
    base_token = f'{task_type}-{"_".join(task_name.split())}'
    token = f'{base_token}-{"".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(5))}'
    while token in existing_tokens:
        token = f'{base_token}-{"".join(random.choice(string.ascii_lowercase + string.digits) for _ in range(5))}'
    
    # Add token to config
    # infer_config[token] = {
    #     'model_filename': f'{token}.pt',
    #     'creation_data': datetime.now().strftime(TIME_FORMAT)
    # }

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
