import torch.nn as nn


def cross_entropy_loss():
    """Create Cross Entropy Loss.
    The loss automatically applies the softmax activation
    function on the prediction input.

    Returns:
        Cross entroy loss function
    """
    return nn.CrossEntropyLoss()
