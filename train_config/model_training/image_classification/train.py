import os
import torch
import torch.nn as nn

from tensornet.data import Dataset
from tensornet.data.cleaning import clean_data, split_data
from tensornet.models import resnet18
from tensornet.models.loss import cross_entropy_loss
from tensornet.models.optimizer import sgd
from tensornet.engine.ops import ModelCheckpoint
from tensornet.engine.ops.lr_scheduler import reduce_lr_on_plateau
from tensornet.utils import initialize_cuda, plot_metric


def train_classification(config):
    print(config)
