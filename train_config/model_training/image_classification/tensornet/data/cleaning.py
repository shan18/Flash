import os
import shutil
import random

from skimage import io
from PIL import Image


def remove_invalid_files(path):
    """Remove corrupt and non-image files"""
    for file in os.listdir(path):
        img_path = os.path.join(path, file)
        if os.path.splitext(file)[-1].lower() in ['.jpg', '.jpeg', '.png']:
            try:  # corrupt image
                img = io.imread(img_path)
            except:
                os.remove(img_path)
        else:  # non-image file
            os.remove(img_path)


def convert_to_rgb_jpg(path):
    """Convert PNG and grayscale images to RGB JPG format."""
    for img in os.listdir(path):
        image = os.path.join(path, img)
        if image.lower().endswith('.png'):
            img = Image.open(image)
            rgb_img = img.convert('RGB')
            rgb_img.save(f'{os.path.splitext(image)[0]}.jpg')
            os.remove(image)
        else:
            img = io.imread(image)
            img_dim = img.shape
            if len(img_dim) == 3:
                channels = img_dim[-1]
            else:
                channels = 1
            
            if channels == 1 or channels == 4:
                img = Image.open(image)
                rgb_img = img.convert('RGB')
                rgb_img.save(f'{os.path.splitext(image)[0]}.jpg')
                os.remove(image)


def rename_jpeg(path):
    """Rename .jpeg files to .jpg"""
    for file in os.listdir(path):
        if os.path.splitext(file)[-1] in ['.JPG', '.JPEG', '.jpeg']:
            img_path = os.path.join(path, file)
            os.rename(img_path, f'{os.path.splitext(img_path)[0]}.jpg')


def clean_data(path):
    """Clean dataset images."""

    for data_dir in os.listdir(path):
        print('Processing directory', data_dir)
        data_dir_path = os.path.join(path, data_dir)

        print('Removing corrupt and non-image files...')
        remove_invalid_files(data_dir_path)

        print('Converting PNG and grayscale images to RGB JPG format...')
        convert_to_rgb_jpg(data_dir_path)

        print('Renaming .jpeg files to .jpg...')
        rename_jpeg(data_dir_path)

        print('Done.\n')


def split_data(src_path, target_path, split_value=0.7):
    """Split data into train and test set."""

    # Create dirs
    os.makedirs(target_path)
    os.makedirs(os.path.join(target_path, 'train'))
    os.makedirs(os.path.join(target_path, 'test'))

    for data_dir in os.listdir(src_path):
        # Directory paths
        src_data_dir = os.path.join(src_path, data_dir)
        target_train_dir = os.path.join(target_path, 'train', data_dir)
        target_test_dir = os.path.join(target_path, 'test', data_dir)

        # Create dirs
        os.makedirs(target_train_dir)
        os.makedirs(target_test_dir)

        # Split dataset
        src_files = os.listdir(src_data_dir)
        train_files = list(set(random.sample(src_files, int(len(src_files) * split_value))))
        test_files = list(set(src_files) - set(train_files))

        # Copy split files
        for file in train_files:
            shutil.copy(os.path.join(src_data_dir, file), target_train_dir)
        for file in test_files:
            shutil.copy(os.path.join(src_data_dir, file), target_test_dir)
