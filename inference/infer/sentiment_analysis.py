import pickle
import torch
from collections import defaultdict

from sentiment_analysis_model import TextClassificationModel


def read_metadata(metadata_path):
    print('Reading metadata')
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
        model_params = metadata['model_params']
        label_itos = metadata['label_itos']

        input_stoi = defaultdict(lambda: model_params['unk_idx'])
        for k, v in metadata['input_stoi'].items():
            input_stoi[k] = v

    return input_stoi, label_itos, model_params


def load_model(model_path, input_stoi, model_params):
    print('loading rnn model')
    model = TextClassificationModel(
        model_params['rnn_type'],
        model_params['vocab_size'],
        model_params['embedding_dim'],
        model_params['hidden_dim'],
        model_params['output_dim'],
        model_params['n_layers'],
        model_params['bidirectional'],
        model_params['dropout'],
        model_params['pad_idx'],
    )
    model.load_state_dict(torch.load(model_path))
    model = model.eval()
    return model


def get_sentiment(input_sentence, model_path, metadata_path):
    input_stoi, label_itos, model_params = read_metadata(metadata_path)
    model = load_model(model_path, input_stoi, model_params)

    tokenized = [tok for tok in input_sentence.split()]
    indexed = [input_stoi[t] for t in tokenized]
    tensor = torch.LongTensor(indexed)
    tensor = tensor.unsqueeze(1)
    length_tensor = torch.LongTensor([len(indexed)])
    prediction = model(tensor, length_tensor)
    _, prediction = torch.max(prediction, 1)

    return label_itos[prediction.item()]
