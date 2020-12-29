import json
import base64
from requests_toolbelt.multipart import decoder


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
