from .tensornet.models.loss import cross_entropy_loss
from .tensornet.models.optimizer import sgd, adam
from .tensornet.engine.ops import ModelCheckpoint
from .tensornet.engine.ops.lr_scheduler import reduce_lr_on_plateau, step_lr


def configure_training_params(config, model, checkpoint_path):
    # Criterion
    criterion = cross_entropy_loss()

    # Optimizer
    if config['optimizer'] == 'sgd':
        optimizer = sgd(model, learning_rate=config['learning_rate'])
    else:
        optimizer = adam(model, learning_rate=config['learning_rate'])

    # Callbacks
    callbacks = [
        ModelCheckpoint(checkpoint_path, monitor='val_accuracy')
    ]
    if config['reduce_lr_on_plateau']:
        reduce_lr_config = config['reduce_lr_on_plateau']
        callbacks += [
            reduce_lr_on_plateau(
                optimizer,
                factor=reduce_lr_config['factor'],
                patience=reduce_lr_config['patience'],
                min_lr=reduce_lr_config['min_lr'],
            )
        ]
    if config['step_lr']:
        step_lr_config = config['step_lr']
        callbacks += [
            step_lr(
                optimizer,
                step_size=step_lr_config['step_size'],
                gamma=step_lr_config['gamma']
            )
        ]

    return criterion, optimizer, callbacks


def fit_model(config, model, train_loader, val_loader, device, checkpoint_path):
    # Get training parameters
    criterion, optimizer, callbacks = configure_training_params(
        config, model, checkpoint_path
    )

    # Train model
    model.fit(
        train_loader,
        optimizer,
        criterion,
        device=device,
        epochs=config['epochs'],
        val_loader=val_loader,
        callbacks=callbacks,
        metrics=['accuracy'],
    )

    return model
