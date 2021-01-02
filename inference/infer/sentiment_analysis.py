import pickle
import torch

from sentiment_analysis_model import RNN


def read_metadata(metadata_path):
    print('Reading metadata')
    with open(metadata_path, 'rb') as f:
        metadata = pickle.load(f)
        input_stoi = metadata['input_stoi']
        label_itos = metadata['label_itos']
    return input_stoi, label_itos


def load_model(model_path, input_stoi):
    print('loading rnn model')
    model = RNN(
        len(set(input_stoi.values())), 100, 256, 1, 
        2, True, 0.5, input_stoi['<pad>']
    )
    model.load_state_dict(torch.load(model_path))
    model = model.eval()
    return model


def get_sentiment(input_sentence, model_path, metadata_path):
    input_stoi, label_itos = read_metadata(metadata_path)
    model = load_model(model_path, input_stoi)

    tokenized = [tok for tok in input_sentence.split()]
    indexed = [input_stoi[t] for t in tokenized]
    tensor = torch.LongTensor(indexed)
    tensor = tensor.unsqueeze(1)
    length_tensor = torch.LongTensor([len(indexed)])
    prediction = torch.sigmoid(model(tensor, length_tensor))

    return label_itos[round(prediction.item())]
