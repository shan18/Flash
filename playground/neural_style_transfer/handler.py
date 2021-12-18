try:
    import unzip_requirements
except ImportError:
    pass

import io
import json
import base64
import boto3
from PIL import Image
from requests_toolbelt.multipart import decoder

from style_image import stylize

MODEL_PATH = 'msg.model'


def fetch_inputs(event):
    print('Fetching Content-Type')
    if 'Content-Type' in event['headers']:
        content_type_header = event['headers']['Content-Type']
    else:
        content_type_header = event['headers']['content-type']
    print('Loading body...')
    body = base64.b64decode(event['body'])
    print('Body loaded')

    # Obtain the final picture that will be used by the model
    decoded = decoder.MultipartDecoder(body, content_type_header).parts
    picture, style_idx = decoded[0], decoded[1]
    print('Picture obtained')
    
    return picture.content, int(style_idx.content.decode('utf-8'))


def style(event, context):
    """Style the content image."""
    try:
        # Get image from the request
        picture, style_idx = fetch_inputs(event)
        image = Image.open(io.BytesIO(picture))

        # Style
        output = stylize(image, style_idx, model=MODEL_PATH)

        # Convert output to bytes
        buffer = io.BytesIO()
        output.save(buffer, format="JPEG")
        output_bytes = base64.b64encode(buffer.getvalue())

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'data': output_bytes.decode('ascii')})
        }
    except Exception as e:
        print(repr(e))
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'error': repr(e)})
        }
