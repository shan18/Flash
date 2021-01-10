import time
import torch
from torch import nn, optim
from torch.optim.lr_scheduler import ReduceLROnPlateau


def epoch_time(start_time, end_time):
    elapsed_time = end_time - start_time
    elapsed_mins = int(elapsed_time / 60)
    elapsed_secs = int(elapsed_time - (elapsed_mins * 60))
    return elapsed_mins, elapsed_secs


def calculate_accuracy(preds, y):
    _, predictions = torch.max(preds, 1)
    correct = (predictions == y).float()
    accuracy = correct.sum() / len(correct)
    return accuracy


def configure_training_params(config, model, checkpoint_path):
    # Criterion
    criterion = nn.CrossEntropyLoss()

    # Optimizer
    if config['optimizer'] == 'sgd':
        optimizer = optim.SGD(model.parameters(), lr=config['learning_rate'])
    else:
        optimizer = optim.Adam(model.parameters(), lr=config['learning_rate'])

    # Callbacks
    scheduler = None
    if config['reduce_lr_on_plateau']:
        reduce_lr_config = config['reduce_lr_on_plateau']
        scheduler = ReduceLROnPlateau(
            optimizer,
            factor=reduce_lr_config['factor'],
            patience=reduce_lr_config['patience'],
            min_lr=reduce_lr_config['min_lr'],
        )

    return criterion, optimizer, scheduler


def train(model, loader, optimizer, criterion):
    epoch_loss = 0
    epoch_accuracy = 0

    model.train()

    for batch in loader:
        optimizer.zero_grad()
        text, text_lengths = batch.text
        predictions = model(text, text_lengths.cpu()).squeeze(1)
        loss = criterion(predictions, batch.label)
        accuracy = calculate_accuracy(predictions, batch.label)
        loss.backward()
        optimizer.step()
        epoch_loss += loss.item()
        epoch_accuracy += accuracy.item()

    return epoch_accuracy / len(loader)


def evaluate(model, loader, criterion):
    epoch_loss = 0
    epoch_accuracy = 0

    model.eval()

    with torch.no_grad():
        for batch in loader:
            text, text_lengths = batch.text
            predictions = model(text, text_lengths.cpu()).squeeze(1)
            loss = criterion(predictions, batch.label)
            accuracy = calculate_accuracy(predictions, batch.label)
            epoch_loss += loss.item()
            epoch_accuracy += accuracy.item()

    return epoch_loss / len(loader), epoch_accuracy / len(loader)


def fit_model(config, model, train_loader, test_loader, device, checkpoint_path):
    # Get training parameters
    criterion, optimizer, scheduler = configure_training_params(
        config, model, checkpoint_path
    )

    # Train model
    criterion = criterion.to(device)

    best_test_accuracy = 0
    train_accuracies = []
    test_accuracies = []

    for epoch in range(config['epochs']):
        # Start time
        start_time = time.time()

        train_accuracy = train(model, train_loader, optimizer, criterion)  # Training data
        test_loss, test_accuracy = evaluate(model, test_loader, criterion)  # Validation data

        # Save accuracies for plot
        train_accuracies.append(train_accuracy)
        test_accuracies.append(test_accuracy)

        # Reduce LR on Plateau
        if not scheduler is None:
            scheduler.step(test_loss)

        # End time
        end_time = time.time()

        # Elasped time
        epoch_mins, epoch_secs = epoch_time(start_time, end_time)

        # Update best accuracy
        if test_accuracy > best_test_accuracy:
            best_test_accuracy = test_accuracy
            torch.save(model.state_dict(), f'{checkpoint_path}/model.pt')

        print(f'Epoch: {epoch + 1:02} | Epoch Time: {epoch_mins}m {epoch_secs}s')
        print(f'\tTrain Acc: {train_accuracy * 100:.2f}%')
        print(f'\tTest Acc: {test_accuracy * 100:.2f}%')

    return model, best_test_accuracy, train_accuracies, test_accuracies
