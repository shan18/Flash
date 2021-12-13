from torch.optim.lr_scheduler import StepLR, ReduceLROnPlateau

def step_lr(optimizer, step_size, gamma=0.1, last_epoch=-1):
    """Create LR step scheduler.
    Args:
        optimizer (torch.optim): Model optimizer.
        step_size (int): Frequency for changing learning rate.
        gamma (:obj:`float`, optional): Factor for changing learning rate. (default: 0.1)
        last_epoch (:obj:`int`, optional): The index of last epoch. (default: -1)
    Returns:
        StepLR: Learning rate scheduler.
    """

    return StepLR(optimizer, step_size=step_size, gamma=gamma, last_epoch=last_epoch)


def reduce_lr_on_plateau(optimizer, factor=0.1, patience=10, verbose=False, min_lr=0):
    """Create LR plateau reduction scheduler.

    Args:
        optimizer (torch.optim): Model optimizer.
        factor (float, optional): Factor by which the learning rate will be reduced.
            (default: 0.1)
        patience (int, optional): Number of epoch with no improvement after which learning
            rate will be will be reduced. (default: 10)
        verbose (bool, optional): If True, prints a message to stdout for each update.
            (default: False)
        min_lr (float, optional): A scalar or a list of scalars. A lower bound on the
            learning rate of all param groups or each group respectively. (default: 0)

    Returns:
        ReduceLROnPlateau instance.
    """

    return ReduceLROnPlateau(
        optimizer, factor=factor, patience=patience, verbose=verbose, min_lr=min_lr
    )
