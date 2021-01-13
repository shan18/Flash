import os
import torchvision

from .processing import Transformations, data_loader
from .utils import unnormalize, normalize


class Dataset:
    """Loads a dataset."""

    def __init__(
        self, train_batch_size=1, val_batch_size=1, cuda=False,
        num_workers=1, path=None, random_resize_crop=(0, 0),
        scale=(0, 0), horizontal_flip_prob=0.0, vertical_flip_prob=0.0,
        gaussian_blur_prob=0.0, rotate_degree=0.0, cutout_prob=0.0,
        cutout_dim=(8, 8), hue_saturation_prob=0.0, contrast_prob=0.0
    ):
        """Initializes the dataset for loading.

        Args:
            train_batch_size (int, optional): Number of images to consider
                in each batch in train set. (default: 0)
            val_batch_size (int, optional): Number of images to consider
                in each batch in validation set. (default: 0)
            cuda (bool, optional): True is GPU is available. (default: False)
            num_workers (int, optional): How many subprocesses to use for
                data loading. (default: 0)
            path (str, optional): Path where dataset will be downloaded. If
                no path provided, data will be downloaded in a pre-defined
                directory. (default: None)
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
            cutout_dim (tuple, optional): Dimensions of the cutout box
                (height, width). (default: (8, 8))
            hue_saturation_prob (float, optional): Probability of randomly changing hue,
                saturation and value of the input image. (default: 0)
            contrast_prob (float, optional): Randomly changing contrast of the input image.
                (default: 0)
        """

        self.cuda = cuda
        self.num_workers = num_workers
        self.path = path
        self.train_batch_size = train_batch_size
        self.val_batch_size = val_batch_size

        if not os.path.exists(self.path):
            raise ValueError('Invalid path specified.')

        # Set data augmentation parameters
        self.random_resize_crop = random_resize_crop
        self.scale = scale
        self.horizontal_flip_prob = horizontal_flip_prob
        self.vertical_flip_prob = vertical_flip_prob
        self.gaussian_blur_prob = gaussian_blur_prob
        self.rotate_degree = rotate_degree
        self.cutout_prob = cutout_prob
        self.cutout_dim = cutout_dim
        self.hue_saturation_prob = hue_saturation_prob
        self.contrast_prob = contrast_prob

        # Get dataset statistics
        self.image_size = self._get_image_size()
        self.mean = self._get_mean()
        self.std = self._get_std()

        # Get data
        self._split_data()

    def _split_data(self):
        """Split data into training and validation set."""

        # Set training data
        self.train_data = torchvision.datasets.ImageFolder(
            os.path.join(self.path, 'train'),
            transform=self._transform()
        )
        self.classes = self.train_data.classes

        # Set validation data
        self.val_data = torchvision.datasets.ImageFolder(
            os.path.join(self.path, 'test'),
            transform=self._transform(train=False)
        )

    def _transform(self, train=True, normalize=True):
        """Define data transformations

        Args:
            train (bool, optional): If True, download training data
                else download the test data. (default: True)

        Returns:
            Returns data transforms based on the training mode.
        """

        args = {
            'mean': self.mean,
            'std': self.std,
            'random_resize_crop': self.random_resize_crop,
            'scale': self.scale,
            'train': False,
            'normalize': normalize,
        }

        if train:
            args['train'] = True
            args['horizontal_flip_prob'] = self.horizontal_flip_prob
            args['vertical_flip_prob'] = self.vertical_flip_prob
            args['gaussian_blur_prob'] = self.gaussian_blur_prob
            args['rotate_degree'] = self.rotate_degree
            args['cutout_prob'] = self.cutout_prob
            args['cutout_dim'] = self.cutout_dim
            args['hue_saturation_prob'] = self.hue_saturation_prob
            args['contrast_prob'] = self.contrast_prob

        return Transformations(**args)

    def _get_image_size(self):
        """Return shape of data i.e. image size."""
        return (3, 224, 224)

    def _get_mean(self):
        """Returns mean of the entire dataset."""
        return (0.485, 0.456, 0.406)

    def _get_std(self):
        """Returns standard deviation of the entire dataset."""
        return (0.229, 0.224, 0.225)

    def data(self, train=True):
        """Return data based on train mode.

        Args:
            train (bool, optional): True for training data. (default: True)

        Returns:
            Training or validation data and targets.
        """
        data = self.train_data if train else self.val_data
        return data.data, data.targets

    def unnormalize(self, image, transpose=False):
        """Un-normalize a given image.

        Args:
            image (numpy.ndarray or torch.Tensor): A ndarray
                or tensor. If tensor, it should be in CPU.
            transpose (bool, optional): If True, transposed output will
                be returned. This param is effective only when image is
                a tensor. If tensor, the output will have channel number
                as the last dim. (default: False)
        """
        return unnormalize(image, self.mean, self.std, transpose)

    def normalize(self, image, transpose=False, data_type=None):
        """Normalize a given image.

        Args:
            image (numpy.ndarray or torch.Tensor): A ndarray
                or tensor. If tensor, it should be in CPU.
            transpose (bool, optional): If True, transposed output will
                be returned. This param is effective only when image is
                a tensor. If tensor, the output will have channel number
                as the last dim. (default: False)
        """
        return normalize(image, self.mean, self.std, transpose)

    def loader(self, train=True):
        """Create data loader.

        Args:
            train (bool, optional): True for training data. (default: True)

        Returns:
            Dataloader instance.
        """

        loader_args = {
            'batch_size': self.train_batch_size if train else self.val_batch_size,
            'num_workers': self.num_workers,
            'cuda': self.cuda
        }

        return data_loader(
            self.train_data, **loader_args
        ) if train else data_loader(self.val_data, **loader_args)
