import torch
import torch.nn as nn

from image_classification.tensornet.engine.learner import Learner


class BaseModel(nn.Module):

    def __init__(self):
        """This function instantiates all the model layers."""
        super(BaseModel, self).__init__()
        self.learner = None

    def forward(self, x):
        """This function defines the forward pass of the model.

        Args:
            x: Input.

        Returns:
            Model output.
        """
        raise NotImplementedError

    def create_learner(
        self, train_loader, optimizer, criterion, device='cpu',
        epochs=1, l1_factor=0.0, val_loader=None, callbacks=None, metrics=None,
        activate_loss_logits=False, record_train=True
    ):
        """Create Learner object.

        Args:
            train_loader (torch.utils.data.DataLoader): Training data loader.
            optimizer (torch.optim): Optimizer for the model.
            criterion (torch.nn): Loss Function.
            device (str or torch.device): Device where the data
                will be loaded.
            epochs (int, optional): Numbers of epochs to train the model. (default: 1)
            l1_factor (float, optional): L1 regularization factor. (default: 0)
            val_loader (torch.utils.data.DataLoader, optional): Validation data
                loader. (default: None)
            callbacks (list, optional): List of callbacks to be used during training.
                (default: None)
            track (str, optional): Can be set to either 'epoch' or 'batch' and will
                store the changes in loss and accuracy for each batch
                or the entire epoch respectively. (default: 'epoch')
            metrics (list of str, optional): List of names of the metrics for model
                evaluation. (default: None)
        """
        self.learner = Learner(
            train_loader, optimizer, criterion, device=device, epochs=epochs,
            val_loader=val_loader, l1_factor=l1_factor, callbacks=callbacks, metrics=metrics,
            activate_loss_logits=activate_loss_logits, record_train=record_train
        )
        self.learner.set_model(self)

    def set_learner(self, learner):
        """Assign a learner object to the model.

        Args:
            learner (Learner): Learner object.
        """
        self.learner = learner
        self.learner.set_model(self)

    def fit(self, *args, start_epoch=1, **kwargs):
        """Train the model.

        Args:
            start_epoch (int, optional): Start epoch for training.
                (default: 1)
        """

        # Check learner
        if self.learner is None:
            print('Creating a learner object.')
            self.create_learner(*args, **kwargs)

        # Train Model
        self.learner.fit(start_epoch=start_epoch)

    def save_learnable(self, filepath, **kwargs):
        """Save the learnable model.

        Args:
            filepath (str): File in which the model will be saved.
            **kwargs (optional): Additional parameters to save with the model.
        """
        if self.learner is None:
            raise ValueError('Cannot save un-trained model.')

        torch.save({
            'model_state_dict': self.state_dict(),
            'optimizer_state_dict': self.learner.optimizer.state_dict(),
            **kwargs
        }, filepath)

    def save(self, filepath):
        """Save the model.

        Args:
            filepath (str): File in which the model will be saved.
        """
        torch.save(self, filepath)

    def load(self, filepath):
        """Load the model.

        Args:
            filepath (str): File in which the model is be saved.

        Returns:
            Parameters saved inside the checkpoint file.
        """
        checkpoint = torch.load(filepath)
        self.load_state_dict(checkpoint['model_state_dict'])
        return {
            k: v for k, v in checkpoint.items() if k != 'model_state_dict'
        }
