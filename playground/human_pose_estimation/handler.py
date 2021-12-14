try:
    import unzip_requirements
except ImportError:
    pass

import os
import io
import json
import cv2
import numpy as np
import base64
import boto3
from PIL import Image
from requests_toolbelt.multipart import decoder

from model import Model


MODEL_PATH = 'human_pose_estimation.onnx'
THRESHOLD = 0.8


def fetch_input_image(event):
    print('Fetching Content-Type')
    if 'Content-Type' in event['headers']:
        content_type_header = event['headers']['Content-Type']
    else:
        content_type_header = event['headers']['content-type']
    print('Loading body...')
    body = base64.b64decode(event['body'])
    print('Body loaded')

    # Obtain the final picture that will be used by the model
    picture = decoder.MultipartDecoder(body, content_type_header).parts[0]
    print('Picture obtained')
    
    return picture.content


def load_image(image_bytes):
    print('Reading image')
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), -1)
    return img


def draw_pose(model, key_points, image_array, output_shape, threshold):
    is_joint_plotted = [False for i in range(len(model.joints))]
    for pose_pair in model.pose_pairs:
        from_j, to_j = pose_pair

        from_thr, (from_x_j, from_y_j) = key_points[from_j]
        to_thr, (to_x_j, to_y_j) = key_points[to_j]

        image_height, image_width, _ = image_array.shape

        from_x_j, to_x_j = from_x_j * image_width / output_shape[0], to_x_j * image_width / output_shape[0]
        from_y_j, to_y_j = from_y_j * image_height / output_shape[1], to_y_j * image_height / output_shape[1]

        from_x_j, to_x_j = int(from_x_j), int(to_x_j)
        from_y_j, to_y_j = int(from_y_j), int(to_y_j)

        if from_thr > threshold and not is_joint_plotted[from_j]:
            # this is a joint
            cv2.ellipse(image_array, (from_x_j, from_y_j), (4, 4), 0, 0, 360, (255, 255, 255), 30, cv2.FILLED)
            is_joint_plotted[from_j] = True

        if to_thr > threshold and not is_joint_plotted[to_j]:
            # this is a joint
            cv2.ellipse(image_array, (to_x_j, to_y_j), (4, 4), 0, 0, 360, (255, 255, 255), 30, cv2.FILLED)
            is_joint_plotted[to_j] = True

        if from_thr > threshold and to_thr > threshold:
            # this is a joint connection, plot a line
            cv2.line(image_array, (from_x_j, from_y_j), (to_x_j, to_y_j), (255, 0, 0), 12)
            
    return Image.fromarray(cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR))


def estimate_pose(event, context):
    """Perform human pose estimation."""
    try:
        # Get image from the request
        picture = fetch_input_image(event)
        image = load_image(picture)

        print('Loading model')
        model = Model(MODEL_PATH)

        print('Predicting pose')
        pose_layers = model(image)
        key_points = [
            [x[1], x[3]]
            for x in [cv2.minMaxLoc(pose_layer) for pose_layer in pose_layers]
        ]  # [threshold, (x, y)]

        print('Drawing pose')
        pose_image = draw_pose(model, key_points, np.array(image), pose_layers.shape[1:], THRESHOLD)

        print('Loading output to buffer')
        buffer = io.BytesIO()
        pose_image.save(buffer, format="JPEG")
        pose_image_bytes = base64.b64encode(buffer.getvalue())

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({'data': pose_image_bytes.decode('ascii')})
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
