import os
import shutil

from .tensornet.utils import initialize_cuda, plot_metric
from .dataset import configure_dataset
from .model import configure_model, save_model_pt, save_model_onnx
from .train import fit_model


def plot_accuracy_chart(model, target_path):
    plot_metric({
        'Training': model.learner.train_metrics[0]['accuracy'],
        'Validation': model.learner.val_metrics[0]['accuracy']
    }, 'Accuracy', target_path)


def train_img_classification(config):
    # Define paths
    data_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'dataset_files'
    )
    checkpoint_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'checkpoints'
    )
    target_model_path_pt = os.path.join(
        checkpoint_path, f'{config["token"]}.pt'
    )
    target_model_path_onnx = os.path.join(
        checkpoint_path, f'{config["token"]}.onnx'
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
    model = configure_model(config['model'], config['num_classes'], device)

    # Train model
    model = fit_model(config, model, train_loader, val_loader, device, checkpoint_path)

    # Save pt model
    save_model_pt(os.path.join(checkpoint_path, 'model.pt'), target_model_path_pt)

    # Save onnx model
    save_model_onnx(os.path.join(checkpoint_path, 'model.pt'), target_model_path_onnx)

    # Plot accuracy graph
    plot_accuracy_chart(model, accuracy_plot_path)

    # Remove dataset
    shutil.rmtree(data_path)

    return (
        model.learner.checkpoint.best,
        classes,
        target_model_path_pt,
        target_model_path_onnx,
        accuracy_plot_path,
        [checkpoint_path]
    )
