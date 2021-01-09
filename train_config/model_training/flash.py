from s3 import fetch_json
from image_classification import train_classification
from sentiment_analysis import train_sa


# Paths to config files in S3 Bucket
STATUS_CONFIG = 'status.json'
TRAIN_CONFIG = 'training/training.json'
INFERENCE_CONFIG = 'inference.json'


def main():
    # Fetch training configuration
    train_config = fetch_json(TRAIN_CONFIG)

    # Train model
    if train_config['task_type'] == 'classification':
        train_classification(train_config)
    else:
        train_sa(train_config)


if __name__ == '__main__':
    if fetch_json(STATUS_CONFIG)['dev_mode']:
        main()
