import torch
import torch.nn as nn


class TextClassificationModel(nn.Module):
    def __init__(
        self, rnn_type, vocab_size, embedding_dim, hidden_dim, output_dim,
        n_layers, bidirectional, dropout, pad_idx
    ):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=pad_idx)

        self.rnn_type = rnn_type
        if self.rnn_type == 'lstm':
            self.rnn = nn.LSTM(
                embedding_dim,
                hidden_dim,
                num_layers=n_layers,
                bidirectional=bidirectional,
                dropout=dropout
            )
        else:
            self.rnn = nn.GRU(
                embedding_dim,
                hidden_dim,
                num_layers=n_layers,
                bidirectional=bidirectional,
                dropout=dropout
            )
        self.fc = nn.Linear(hidden_dim * 2, output_dim)
        self.dropout = nn.Dropout(dropout)

    def forward(self, text, text_lengths):
        embedded = self.dropout(self.embedding(text))

        # pack sequence
        packed_embedded = nn.utils.rnn.pack_padded_sequence(embedded, text_lengths)
        if self.rnn_type == 'lstm':
            packed_output, (hidden, _) = self.rnn(packed_embedded)
        else:
            packed_output, hidden = self.rnn(packed_embedded)

        # unpack sequence
        output, output_lengths = nn.utils.rnn.pad_packed_sequence(packed_output)

        hidden = self.dropout(torch.cat((hidden[-2, :, :], hidden[-1, :, :]), dim=1))
        return self.fc(hidden)


def configure_model(config, text, device):
    # Define model parameters
    model_params = {
        'rnn_type': config['model'],
        'vocab_size': len(text.vocab),
        'embedding_dim': 100,
        'hidden_dim': 256,
        'output_dim': config['num_classes'],
        'n_layers': 2,
        'bidirectional': True,
        'dropout': 0.5,
        'pad_idx': text.vocab.stoi[text.pad_token],
        'unk_idx': text.vocab.stoi[text.unk_token],
    }

    # Create model
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
    model.embedding.weight.data.copy_(text.vocab.vectors)
    model.embedding.weight.data[model_params['unk_idx']] = torch.zeros(model_params['embedding_dim'])
    model.embedding.weight.data[model_params['pad_idx']] = torch.zeros(model_params['embedding_dim'])

    # Move model to device
    model = model.to(device)

    return model, model_params


def save_model(model, src_path, target_path):
    model.load_state_dict(torch.load(src_path))
    model_cpu = model.to('cpu')
    torch.save(model_cpu.state_dict(), target_path)
