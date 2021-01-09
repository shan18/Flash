import os
import shutil
import torch
import torch.nn as nn

from .tensornet.data import Dataset
from .tensornet.models import resnet34, mobilenet_v2
from .tensornet.models.loss import cross_entropy_loss
from .tensornet.models.optimizer import sgd, adam
from .tensornet.engine.ops import ModelCheckpoint
from .tensornet.engine.ops.lr_scheduler import reduce_lr_on_plateau
from .tensornet.utils import initialize_cuda, plot_metric
from .dataset import create_dataset


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


def configure_model(config, device):
    # Create model
    if config['model'] == 'resnet34':
        model = resnet34(pretrained=True)
        model.fc = nn.Linear(model.fc.in_features, config['num_classes'])
    else:
        model = mobilenet_v2(pretrained=True)
        model.classifier[1] = nn.Linear(1280, config['num_classes'])

    # Move model to device
    model = model.to(device)

    return model


def configure_training_params(config, model, checkpoint_path):
    # Criterion
    criterion = cross_entropy_loss()

    # Optimizer
    if config['optimizer'] == 'sgd':
        optimizer = sgd(model, learning_rate=config['learning_rate'])
    else:
        optimizer = adam(model, learning_rate=config['learning_rate'])

    # Callbacks
    callbacks = [
        ModelCheckpoint(checkpoint_path, monitor='val_accuracy')
    ]
    if config['reduce_lr_on_plateau']:
        reduce_lr_config = config['reduce_lr_on_plateau']
        callbacks += [
            reduce_lr_on_plateau(
                optimizer,
                factor=reduce_lr_config['factor'],
                patience=reduce_lr_config['patience'],
                min_lr=reduce_lr_config['min_lr'],
            )
        ]

    return criterion, optimizer, callbacks


def save_model(src_path, target_path):
    # Load the model with the best validation accuracy
    model = torch.load(src_path)

    # Save the model to CPU for deployment
    model_cpu = model.to('cpu')
    model_cpu = torch.jit.trace(model, torch.randn(1, 3, 224, 224))
    model_cpu.save(target_path)


def plot_accuracy_chart(model, target_path):
    plot_metric({
        'Training': model.learner.train_metrics[0]['accuracy'],
        'Validation': model.learner.val_metrics[0]['accuracy']
    }, 'Accuracy', target_path)


def train_classification(config):
    # Define paths
    data_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'dataset_files'
    )
    checkpoint_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'checkpoints'
    )
    target_model_path = os.path.join(
        checkpoint_path, f'{config["token"]}.pt'
    )
    accuracy_plot_path = os.path.join(
        checkpoint_path, 'accuracy_plot.jpg'
    )

    # Initialize CUDA and set random seed
    cuda, device = initialize_cuda(1)

    # Create dataset
    train_loader, val_loader, classes = configure_dataset(
        config, data_path, cuda
    )

    # Create model
    model = configure_model(config, device)

    # Get training parameters
    criterion, optimizer, callbacks = configure_training_params(
        config, model, checkpoint_path
    )

    # Train model
    model.fit(
        train_loader,
        optimizer,
        criterion,
        device=device,
        epochs=config['epochs'],
        val_loader=val_loader,
        callbacks=callbacks,
        metrics=['accuracy'],
    )

    # Save model
    save_model(os.path.join(checkpoint_path, 'model.pt'), target_model_path)

    # Plot accuracy graph
    plot_accuracy_chart(model, accuracy_plot_path)

    # Remove dataset
    shutil.rmtree(data_path)

    return (
        model.learner.val_metrics[0]['accuracy'][-1],
        classes,
        target_model_path,
        accuracy_plot_path,
        [checkpoint_path]
    )
