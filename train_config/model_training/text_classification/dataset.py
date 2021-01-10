import os
import shutil
import base64
import pandas as pd
import torch
from torchtext import data, vocab


def save_to_csv(dataset_file, target_path):
    with open(target_path, 'wb') as f:
        f.write(base64.b64decode(dataset_file))


def process_dataset(data_dir, csv_path, data_split):
    # Parse split value
    split_value = int(data_split.split(' : ')[0]) / 100

    # Read data
    df = pd.read_csv(csv_path)
    df.input = df.input.str.lower()

    # Split data
    tdf = df.sample(frac=split_value)
    vdf = df.drop(tdf.index)

    # Save
    tdf.to_csv(os.path.join(data_dir, 'train.csv'), index=False)
    vdf.to_csv(os.path.join(data_dir, 'test.csv'), index=False)


def load_dataset(data_dir, embeddings_path, max_vocab_size):
    # Load train and test data
    text = data.Field(sequential=True, tokenize='spacy', include_lengths=True)
    label = data.LabelField(sequential=False, tokenize='spacy', is_target=True)
    fields = [('text', text), ('label', label)]
    train_data, test_data = data.TabularDataset.splits(
        path=data_dir,
        train='train.csv',
        test='test.csv',
        format='csv',
        fields=fields,
        skip_header=True,
    )

    # Load embeddings
    embeddings = vocab.Vectors(name=embeddings_path)

    # Build vocabulary
    text.build_vocab(
        train_data,
        max_size=max_vocab_size,
        vectors=embeddings,
        unk_init=torch.Tensor.normal_
    )
    label.build_vocab(train_data)

    return train_data, test_data, text, label


def create_dataset(dataset_file, data_split, embeddings_path, max_vocab_size):
    # Create directory to store dataset
    data_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dataset_files')
    os.makedirs(data_dir)
    csv_path = os.path.join(data_dir, 'sa_dataset.csv')

    # Save dataset to csv
    save_to_csv(dataset_file, csv_path)

    # Split dataset
    process_dataset(data_dir, csv_path, data_split)

    # Load data
    train_data, test_data, text, label = load_dataset(
        data_dir, embeddings_path, max_vocab_size
    )

    # Delete dataset from disk
    shutil.rmtree(data_dir)

    return train_data, test_data, text, label


def configure_dataset(config, embeddings_path, max_vocab_size, device):
    train_data, test_data, text, label = create_dataset(
        config['dataset'], config['data_split'], embeddings_path, max_vocab_size
    )

    train_iterator, test_iterator = data.BucketIterator.splits(
        (train_data, test_data),
        batch_size=config['batch_size'],
        sort_key=lambda x: len(x.text),
        sort_within_batch=True,
        device=device
    )

    return train_iterator, test_iterator, text, label
