import os
import base64
import pandas as pd


def create_dataset(dataset):
    target_dir = os.path.join(os.path.abspath(__file__), 'data')
    os.makedirs(target_dir, exist_ok=True)
    with open(os.path.join(target_dir, 'dataset.csv'), 'wb') as f:
        f.write(base64.b64decode(dataset))


def train_sa(config):
    create_dataset(config['dataset'])
