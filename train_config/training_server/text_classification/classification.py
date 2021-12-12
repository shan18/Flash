import os
import torch
import pickle
import matplotlib.pyplot as plt

from .dataset import configure_dataset
from .model import configure_model, save_model
from .train import fit_model


def save_metadata(metadata_path, text, label, model_params):
    # Remove torchtext dependency from stoi
    stoi = {}
    for k, v in text.vocab.stoi.items():
        if (k != text.unk_token and v != model_params['unk_idx']) or (k == text.unk_token):
            stoi[k] = v

    # Save
    with open(metadata_path, 'wb') as f:
        metadata = {
            'input_stoi': stoi,
            'label_itos': label.vocab.itos,
            'model_params': model_params,
        }
        pickle.dump(metadata, f)


def plot_accuracy_chart(train_accuracies, test_accuracies, target_path):
    fig = plt.figure(figsize=(7, 5))
    plots = [
        plt.plot(train_accuracies)[0],
        plt.plot(test_accuracies)[0],
    ]
    plt.title('Accuracy Change')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend(
        tuple(plots), tuple(['Train', 'Test']),
        loc='lower right',
        shadow=True,
        prop={'size': 15}
    )
    fig.savefig(target_path)


def train_text_classification(config):
    # Define paths
    embeddings_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'glove.6B.100d.txt'
    )
    checkpoint_path = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        'checkpoints'
    )
    metadata_path = os.path.join(
        checkpoint_path,
        f'{config["token"]}_metadata.pkl'
    )
    target_model_path = os.path.join(
        checkpoint_path, f'{config["token"]}.pt'
    )
    accuracy_plot_path = os.path.join(
        checkpoint_path, 'accuracy_plot.jpg'
    )
    os.makedirs(checkpoint_path)

    # Constants
    max_vocab_size = 25000
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    # Load dataset
    train_loader, test_loader, text, label = configure_dataset(
        config, embeddings_path, max_vocab_size, device
    )

    # Create model
    model, model_params = configure_model(config, text, device)

    # Train model
    model, accuracy, train_accuracies, test_accuracies = fit_model(
        config, model, train_loader, test_loader, device, checkpoint_path
    )

    # Save model
    save_model(model, os.path.join(checkpoint_path, 'model.pt'), target_model_path)

    # Save metadata
    save_metadata(metadata_path, text, label, model_params)

    # Plot accuracy graph
    plot_accuracy_chart(train_accuracies, test_accuracies, accuracy_plot_path)

    return (
        accuracy,
        target_model_path,
        metadata_path,
        accuracy_plot_path,
        [checkpoint_path],
    )
