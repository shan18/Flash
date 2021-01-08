import os
import numpy as np
import torch


class ModelCheckpoint:
    """Store model checkpoint while training."""

    def __init__(self, path, monitor='val_loss', mode='auto', verbose=0, save_best_only=True, best_value=None):
        """Initialize model checkpoint instance.

        Args:
            path (str): Path to the directory where the checkpoints will be stored.
            monitor (str, optional): Metric to monitor. (default: 'val_loss')
            mode (str, optional): Comparison mode for monitored quantity.
                One of {auto, min, max}. (default: 'auto')
            verbose (int, optional): verbosity mode, 0 or 1. (default: 0)
            save_best_only (bool, optional): If True, only the model with the best
                value of monitoring quantity will be saved. (default: True)
            best_value (float, optional): Best value of the monitored metric, this is
                useful when resuming training. This param will work only when
                `save_best_only` is True. (default: None)
        """
        self.verbose = verbose
        self.save_best_only = save_best_only

        # Set path for storing checkpoints
        self.path = path
        if not os.path.exists(self.path):
            os.makedirs(self.path)
        if self.save_best_only:
            self.path = os.path.join(self.path, 'model.pt')
        
        # Used to avoid overriding checkpoint names if save_best_only is False
        self.counter = 0
        
        # Set monitor quantity and mode
        self.monitor = monitor
        self._set_monitor_mode(mode)
        if not best_value is None:
            self.best = best_value
    
    def _set_monitor_mode(self, mode):
        """Set the mode and monitor operation.

        Args:
            mode (str): Comparison mode for monitored quantity. One of {auto, min, max}.
        """

        # Validate mode
        if not mode in ['auto', 'min', 'max']:
            print('WARNING: Invalid mode given. Setting mode to auto.')
        
        # Set mode
        if mode == 'auto':
            if 'loss' in self.monitor:
                self.mode = 'min'
            elif 'accuracy' in self.monitor:
                self.mode = 'max'
            else:
                raise ValueError('Can\'t determine mode value automatically. Please specify a mode.')
        else:
            self.mode = mode
        
        # Set monitor operations
        if self.mode == 'min':
            self.monitor_op = np.less
            self.best = np.Inf
        elif self.mode == 'max':
            self.monitor_op = np.greater
            self.best = -np.Inf
    
    def __call__(self, model, current_value, epoch=None, **kwargs):
        """Compare the current value with the best value and save the model
        accordingly.

        Args:
            model (torch.nn.Module): Model Instance.
            optimizer (torch.optim): Optimizer for the model.
            current_value (float): Current value of the monitored quantity.
            epoch (int): Epoch count.
            **kwargs: Other keyword arguments.
        """

        if current_value is None:
            if self.save_best_only:
                raise ValueError('Metric value cannot be of None type.')
            else:
                current_value = -np.Inf
        
        if self.monitor_op(current_value, self.best) or not self.save_best_only:
            # Set save path
            save_path = self.path
            if not self.save_best_only:
                ckpt_name = f'model-epoch_{epoch}.pt'
                if epoch is None:
                    ckpt_name = f'model-{self.counter}.pt'
                    self.counter += 1
                save_path = os.path.join(self.path, ckpt_name)

            # Save model
            model.save(save_path)
            
            # Print log
            if self.verbose > 0:
                log = f'Saving model to {save_path}\n'
                if self.save_best_only:
                    log = f'{self.monitor} improved from {self.best:.5f} to {current_value:.5f}. ' + log
                print(log)

            # Update best value
            self.best = current_value
