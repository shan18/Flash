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
