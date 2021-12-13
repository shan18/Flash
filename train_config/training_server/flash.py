import os
import shutil
import base64
from datetime import datetime

from s3 import fetch_json, put_object, upload_file, delete_object
from image_classification import train_img_classification
from text_classification import train_text_classification


# Paths to config files in S3 Bucket
STATUS_CONFIG = 'status.json'
TRAIN_CONFIG = 'training/training.json'
INFERENCE_CONFIG = 'inference.json'


def image_to_base64(img_path):
    with open(img_path, 'rb') as img_file:
        b64_img = base64.b64encode(img_file.read()).decode()
    return b64_img


def setup_inference(token, task_type, accuracy, model_path, acc_plot_path, metadata, model_path_onnx=None):
    inference_config = fetch_json(INFERENCE_CONFIG)

    # Upload model
    s3_model_path = os.path.join(task_type, os.path.basename(model_path))
    upload_file(model_path, s3_model_path)

    if model_path_onnx is not None:
        s3_model_path_onnx = os.path.join(task_type, os.path.basename(model_path_onnx))
        upload_file(model_path_onnx, s3_model_path_onnx)
        metadata['model_filename_onnx'] = s3_model_path_onnx

    if task_type == 'textclassification':
        s3_meta_path = os.path.join(task_type, os.path.basename(metadata['metadata_filename']))
        upload_file(metadata['metadata_filename'], s3_meta_path)
        metadata['metadata_filename'] = s3_meta_path

    # Upload new inference config to S3
    inference_config[token] = {
        'task_type': task_type,
        'model_filename': s3_model_path,
        **metadata,
        'accuracy': accuracy,
        'accuracy_plot': image_to_base64(acc_plot_path),
        'created': datetime.now().strftime('%d-%m-%y %H:%M')
    }
    put_object(INFERENCE_CONFIG, inference_config)


def main():
    print('Fetching training configuration')
    train_config = fetch_json(TRAIN_CONFIG)
    model_path_onnx = None
    
    # Train model
    if train_config['task_type'] == 'imageclassification':
        print('Starting image classification')
        accuracy, classes, model_path_pt, model_path_onnx, acc_plot_path, remove_paths = train_img_classification(train_config)
        metadata = {'classes': classes}
    else:
        print('Starting text classification')
        accuracy, model_path_pt, metadata_path, acc_plot_path, remove_paths = train_text_classification(train_config)
        metadata = {'metadata_filename': metadata_path}

    # Deploy model
    print('Deploying model')
    setup_inference(
        train_config['token'],
        train_config['task_type'],
        accuracy,
        model_path_pt,
        acc_plot_path,
        metadata,
        model_path_onnx=model_path_onnx
    )

    # Clear files
    for remove_path in remove_paths:
        shutil.rmtree(remove_path)

    # Delete training config from S3
    # This will also shutdown the instance
    delete_object(TRAIN_CONFIG)


if __name__ == '__main__':
    if not fetch_json(STATUS_CONFIG)['dev_mode']:
        main()
