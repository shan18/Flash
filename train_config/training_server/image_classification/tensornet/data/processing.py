import numpy as np
import torch
import albumentations as A
from albumentations.pytorch import ToTensor


class Transformations:
    """Wrapper class to pass on albumentaions transforms into PyTorch."""

    def __init__(
        self, random_resize_crop=(0, 0), scale=(0, 0), horizontal_flip_prob=0.0,
        vertical_flip_prob=0.0, gaussian_blur_prob=0.0, rotate_degree=0.0,
        cutout_prob=0.0, cutout_dim=(8, 8), hue_saturation_prob=0.0, contrast_prob=0.0,
        mean=(0.5, 0.5, 0.5), std=(0.5, 0.5, 0.5), normalize=True, train=True
    ):
        """Create data transformation pipeline.

        Args:
            random_resize_crop (tuple, optional): Randomly resize and crop the
                input to the given height and width. (default: (0, 0))
            scale (tuple, optional): Range of size of the origin size cropped.
                (default: (0, 0))
            horizontal_flip_prob (float, optional): Probability of an image
                being horizontally flipped. (default: 0)
            vertical_flip_prob (float, optional): Probability of an image
                being vertically flipped. (default: 0)
            rotate_degree (float, optional): Angle of rotation for image
                augmentation. (default: 0)
            cutout_prob (float, optional): Probability that cutout will be
                performed. (default: 0)
            cutout_dim (tuple, optional): Dimensions of the cutout box (height, width).
                (default: (8, 8))
            hue_saturation_prob (float, optional): Probability of randomly changing hue,
                saturation and value of the input image. (default: 0)
            contrast_prob (float, optional): Randomly changing contrast of the input image.
                (default: 0)
            mean (float or tuple, optional): Dataset mean. (default: 0.5 for each channel)
            std (float or tuple, optional): Dataset standard deviation.
                (default: 0.5 for each channel)
        """
        transforms_list = []

        if sum(random_resize_crop) > 0:
            transforms_list += [A.RandomResizedCrop(
                random_resize_crop[0], random_resize_crop[1], scale=scale, always_apply=True
            )]
        if train:
            if horizontal_flip_prob > 0:  # Horizontal Flip
                transforms_list += [A.HorizontalFlip(p=horizontal_flip_prob)]
            if vertical_flip_prob > 0:  # Vertical Flip
                transforms_list += [A.VerticalFlip(p=vertical_flip_prob)]
            if gaussian_blur_prob > 0:  # Patch Gaussian Augmentation
                transforms_list += [A.GaussianBlur(p=gaussian_blur_prob)]
            if rotate_degree > 0:  # Rotate image
                transforms_list += [A.Rotate(limit=rotate_degree)]
            if cutout_prob > 0:  # CutOut
                if isinstance(mean, float):
                    fill_value = mean * 255.0
                else:
                    fill_value = tuple([x * 255.0 for x in mean])
                transforms_list += [A.CoarseDropout(
                    p=cutout_prob, max_holes=1, fill_value=fill_value,
                    max_height=cutout_dim[0], max_width=cutout_dim[1]
                )]
            if hue_saturation_prob > 0:  # Hue Saturation
                transforms_list += [A.HueSaturationValue(p=hue_saturation_prob)]
            if contrast_prob > 0:  # Random Contrast
                transforms_list += [A.RandomContrast(p=contrast_prob)]
        if normalize:
            # normalize the data with mean and standard deviation to keep values in range [-1, 1]
            # since there are 3 channels for each image,
            # we have to specify mean and std for each channel
            transforms_list += [
                A.Normalize(mean=mean, std=std, always_apply=True),
            ]

        # convert the data to torch.FloatTensor
        transforms_list += [
            ToTensor()
        ]

        self.transform = A.Compose(transforms_list)

    def __call__(self, image):
        """Process and image through the data transformation pipeline.

        Args:
            image: Image to process.

        Returns:
            Transformed image.
        """
        if not isinstance(image, np.ndarray):
            image = np.array(image)
            if len(image.shape) == 2:
                image = np.expand_dims(image, axis=-1)
        image = self.transform(image=image)['image']
        return image


def data_loader(data, shuffle=True, batch_size=1, num_workers=1, cuda=False):
    """Create data loader

    Args:
        data (torchvision.datasets): Downloaded dataset.
        shuffle (bool, optional): If True, shuffle the dataset.
            (default: True)
        batch_size (int, optional): Number of images to considered
            in each batch. (default: 1)
        num_workers (int, optional): How many subprocesses to use
            for data loading. (default: 1)
        cuda (bool, optional): True is GPU is available. (default: False)

    Returns:
        DataLoader instance.
    """

    loader_args = {
        'shuffle': shuffle,
        'batch_size': batch_size,
    }

    # If GPU exists
    if cuda:
        loader_args['num_workers'] = num_workers
        loader_args['pin_memory'] = True

    return torch.utils.data.DataLoader(data, **loader_args)


class InfiniteDataLoader:
    """Create infinite loop in a data loader.

    Args:
        data_loader (torch.utils.data.DataLoader): DataLoader object.
        auto_reset (bool, optional): Create an infinite loop data loader.
            (default: True)
    """

    def __init__(self, data_loader, auto_reset=True):
        self.data_loader = data_loader
        self.auto_reset = auto_reset
        self._iterator = iter(data_loader)

    def __next__(self):
        # Get a new set of inputs and labels
        try:
            data, target = next(self._iterator)
        except StopIteration:
            if not self.auto_reset:
                raise
            self._iterator = iter(self.data_loader)
            data, target = next(self._iterator)

        return data, target

    def get_batch(self):
        return next(self)
