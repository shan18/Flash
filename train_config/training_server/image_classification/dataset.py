import os
import io
import base64
import shutil
import random
from PIL import Image

from .tensornet.data import Dataset


def config_to_data(dataset_files, raw_data_dir):
    """Save base64 data to files."""
    for class_name, images in dataset_files.items():
        # Create class directory
        class_dir = os.path.join(raw_data_dir, class_name)
        os.makedirs(class_dir)

        # Store Images
        for count, image in enumerate(images):
            try:
                img = Image.open(
                    io.BytesIO(base64.b64decode(image))
                )
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                img.save(
                    os.path.join(
                        class_dir,
                        f'{class_name}_{count:03d}.jpg'
                    )
                )
            except Exception:
                continue


def split_data(raw_data_dir, target_dir, split_value):
    """Split data into train and test set."""

    # Create dirs
    os.makedirs(target_dir)
    os.makedirs(os.path.join(target_dir, 'train'))
    os.makedirs(os.path.join(target_dir, 'test'))

    for data_dir in os.listdir(raw_data_dir):
        # Directory paths
        src_data_dir = os.path.join(raw_data_dir, data_dir)
        target_train_dir = os.path.join(target_dir, 'train', data_dir)
        target_test_dir = os.path.join(target_dir, 'test', data_dir)

        # Create dirs
        os.makedirs(target_train_dir)
        os.makedirs(target_test_dir)

        # Split dataset
        src_files = os.listdir(src_data_dir)
        train_files = set(random.sample(src_files, int(len(src_files) * split_value)))
        test_files = list(set(src_files) - train_files)
        train_files = list(train_files)

        # Copy split files
        for file in train_files:
            shutil.copy(os.path.join(src_data_dir, file), target_train_dir)
        for file in test_files:
            shutil.copy(os.path.join(src_data_dir, file), target_test_dir)


def create_dataset(dataset_files, data_split, target_dir):
    # Create directory for raw dataset
    raw_data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.raw_data')
    os.makedirs(raw_data_dir)

    # Parse split value
    split_value = int(data_split.split(' : ')[0]) / 100

    # Create dataset
    config_to_data(dataset_files, raw_data_dir)
    split_data(raw_data_dir, target_dir, split_value)

    # Delete raw dataset
    shutil.rmtree(raw_data_dir)


def configure_dataset(config, data_path, cuda):
    create_dataset(config['dataset'], config['data_split'], data_path)

    dataset = Dataset(
        train_batch_size=int(config['batch_size']),
        val_batch_size=int(config['batch_size']),
        cuda=cuda,
        num_workers=16,
        path=data_path,
        random_resize_crop=(224, 224),
        scale=(0.4, 1.0),
        horizontal_flip_prob=0.5,
    )

    # Create data loaders
    train_loader = dataset.loader(train=True)
    val_loader = dataset.loader(train=False)

    return train_loader, val_loader, dataset.classes
