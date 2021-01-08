import torch.optim as optim


def sgd(model, learning_rate=0.01, momentum=0, dampening=0, l2_factor=0.0, nesterov=False):
    """Create optimizer.

    Args:
        model (torch.nn.Module): Model Instance.
        learning_rate (float, optional): Learning rate for the optimizer. (default: 0.01)
        momentum (float, optional): Momentum factor. (default: 0)
        dampening (float, optional): Dampening for momentum. (default: 0)
        l2_factor (float, optional): Factor for L2 regularization. (default: 0)
        nesterov (bool, optional): Enables nesterov momentum. (default: False)
    
    Returns:
        SGD optimizer.
    """
    return optim.SGD(
        model.parameters(),
        lr=learning_rate,
        momentum=momentum,
        dampening=dampening,
        weight_decay=l2_factor,
        nesterov=nesterov
    )
