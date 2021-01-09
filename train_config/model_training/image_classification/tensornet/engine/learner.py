import time
import torch

from .ops.regularizer import l1
from .ops.checkpoint import ModelCheckpoint
from image_classification.tensornet.utils.progress_bar import ProgressBar


class Learner:

    def __init__(
        self, train_loader, optimizer, criterion, device='cpu',
        epochs=1, l1_factor=0.0, val_loader=None, callbacks=None, metrics=None,
        activate_loss_logits=False, record_train=True
    ):
        """Train and validate the model.

        Args:
            train_loader (torch.utils.data.DataLoader): Training data loader.
            optimizer (torch.optim): Optimizer for the model.
            criterion (torch.nn): Loss Function.
            device (str or torch.device, optional): Device where the data
                will be loaded. (default='cpu')
            epochs (int, optional): Numbers of epochs/iterations to train the model for.
                (default: 1)
            l1_factor (float, optional): L1 regularization factor. (default: 0)
            val_loader (torch.utils.data.DataLoader, optional): Validation data
                loader. (default: None)
            callbacks (list, optional): List of callbacks to be used during training.
                (default: None)
            metrics (list of str, optional): List of names of the metrics for model
                evaluation. (default: None)
            activate_loss_logits (bool, optional): If True, the logits will first pass
                through the `activate_logits` function before going to the criterion.
                (default: False)
            record_train (bool, optional): If False, metrics will be calculated only
                during validation. (default: True)
        """
        self.model = None
        self.optimizer = optimizer
        self.criterion = criterion
        self.train_loader = train_loader
        self.device = device
        self.epochs = epochs
        self.val_loader = val_loader
        self.l1_factor = l1_factor
        self.activate_loss_logits = activate_loss_logits
        self.record_train = record_train

        self.lr_schedulers = {
            'step_lr': None,
            'lr_plateau': None,
            'one_cycle_policy': None,
        }
        self.checkpoint = None
        if not callbacks is None:
            self._setup_callbacks(callbacks)

        # Training
        self.train_losses = []  # Change in loss
        self.train_metrics = []  # Change in evaluation metric

        self.val_losses = []  # Change in loss
        self.val_metrics = []  # Change in evaluation metric

        # Set evaluation metrics
        self.metrics = []
        if metrics:
            self._setup_metrics(metrics)

    def _setup_callbacks(self, callbacks):
        """Extract callbacks passed to the class.

        Args:
            callbacks (list): List of callbacks.
        """
        for callback in callbacks:
            if isinstance(callback, torch.optim.lr_scheduler.ReduceLROnPlateau):
                self.lr_schedulers['lr_plateau'] = callback
            elif isinstance(callback, ModelCheckpoint):
                if callback.monitor.startswith('train_'):
                    if self.record_train:
                        self.checkpoint = callback
                    else:
                        raise ValueError(
                            'Cannot use checkpoint for a training metric if record_train is set to False'
                        )
                else:
                    self.checkpoint = callback

    def set_model(self, model):
        """Assign model to learner.

        Args:
            model (torch.nn.Module): Model Instance.
        """
        self.model = model

    def _accuracy(self, label, prediction, idx=0):
        """Calculate accuracy.

        Args:
            label (torch.Tensor): Ground truth.
            prediction (torch.Tensor): Prediction.

        Returns:
            accuracy
        """
        self.metrics[idx]['accuracy']['sum'] += prediction.eq(
            label.view_as(prediction)
        ).sum().item()
        self.metrics[idx]['accuracy']['num_steps'] += len(label)
        self.metrics[idx]['accuracy']['value'] = round(
            100 * self.metrics[idx]['accuracy']['sum'] / self.metrics[idx]['accuracy']['num_steps'], 2
        )

    def _setup_metrics(self, metrics):
        """Validate the evaluation metrics passed to the class.

        Args:
            metrics (list or dict): Metrics.
        """

        if not isinstance(metrics[0], (list, tuple)):
            metrics = [metrics]

        for idx, metric_list in enumerate(metrics):
            metric_dict = {}
            for metric in metric_list:
                metric_info = {'value': 0, 'sum': 0, 'num_steps': 0}
                if metric == 'accuracy':
                    metric_info['func'] = self._accuracy

                if 'func' in metric_info:
                    metric_dict[metric] = metric_info

            if metric_dict:
                self.metrics.append(metric_dict)
                self.train_metrics.append({
                    x: [] for x in metric_dict.keys()
                })
                self.val_metrics.append({
                    x: [] for x in metric_dict.keys()
                })

    def _calculate_metrics(self, labels, predictions):
        """Update evaluation metric values.

        Args:
            label (torch.Tensor or dict): Ground truth.
            prediction (torch.Tensor or dict): Prediction.
        """
        predictions = self.activate_logits(predictions)

        if not isinstance(labels, (list, tuple)):
            labels = [labels]
            predictions = [predictions]

        for idx, (label, prediction) in enumerate(zip(labels, predictions)):
            # If predictions are one-hot encoded
            if label.size() != prediction.size():
                prediction = prediction.argmax(dim=1, keepdim=True) * 1.0

            if idx < len(self.metrics):
                for metric in self.metrics[idx]:
                    self.metrics[idx][metric]['func'](
                        label, prediction, idx=idx
                    )

    def _reset_metrics(self):
        """Reset metric params."""
        for idx in range(len(self.metrics)):
            for metric in self.metrics[idx]:
                self.metrics[idx][metric]['value'] = 0
                self.metrics[idx][metric]['sum'] = 0
                self.metrics[idx][metric]['num_steps'] = 0

    def _get_pbar_values(self, loss):
        """Create progress bar description.

        Args:
            loss (float): Loss value.
        """
        pbar_values = [('loss', round(loss, 2))]
        if self.metrics and self.record_train:
            for idx in range(len(self.metrics)):
                for metric, info in self.metrics[idx].items():
                    metric_name = metric
                    if len(self.metrics) > 1:
                        metric_name = f'{idx} - {metric}'
                    pbar_values.append((metric_name, info['value']))
        return pbar_values

    def update_training_history(self, loss):
        """Update the training history.

        Args:
            loss (float): Loss value.
        """
        self.train_losses.append(loss)
        if self.record_train:
            for idx in range(len(self.metrics)):
                for metric in self.metrics[idx]:
                    self.train_metrics[idx][metric].append(
                        self.metrics[idx][metric]['value']
                    )

    def reset_history(self):
        """Reset the training history"""
        self.train_losses = []
        self.val_losses = []
        for idx in range(len(self.metrics)):
            for metric in self.metrics[idx]:
                self.train_metrics[idx][metric] = []
                self.val_metrics[idx][metric] = []
        self._reset_metrics()

    def activate_logits(self, logits):
        """Apply activation function to the logits if needed.
        After this the logits will be sent for calculation of
        loss or evaluation metrics.

        Args:
            logits: Model output

        Returns:
            activated logits
        """
        return logits

    def calculate_criterion(self, logits, targets, train=True):
        """Calculate loss.

        Args:
            logits (torch.Tensor): Prediction.
            targets (torch.Tensor): Ground truth.
            train (bool, optional): If True, loss is sent to the
                L1 regularization function. (default: True)

        Returns:
            loss value
        """
        if self.activate_loss_logits:
            logits = self.activate_logits(logits)
        if train:
            return l1(self.model, self.criterion(logits, targets), self.l1_factor)
        return self.criterion(logits, targets)

    def fetch_data(self, data):
        """Fetch data from loader and load it to GPU.

        Args:
            data (list or tuple): List containing inputs and targets.

        Returns:
            inputs and targets loaded to GPU.
        """
        return data[0].to(self.device), data[1].to(self.device)

    def train_batch(self, data):
        """Train the model on a batch of data.

        Args:
            data: Input and target data for the model.

        Returns:
            Batch loss.
        """
        inputs, targets = self.fetch_data(data)
        self.optimizer.zero_grad()  # Set gradients to zero before starting backpropagation
        y_pred = self.model(inputs)  # Predict output
        loss = self.calculate_criterion(y_pred, targets, train=True)  # Calculate loss

        # Perform backpropagation
        loss.backward()
        self.optimizer.step()

        if self.record_train:
            self._calculate_metrics(targets, y_pred)

        # One Cycle Policy for learning rate
        if not self.lr_schedulers['one_cycle_policy'] is None:
            self.lr_schedulers['one_cycle_policy'].step()

        return loss.item()

    def train_epoch(self):
        """Run an epoch of model training."""

        self.model.train()
        pbar = ProgressBar(target=len(self.train_loader), width=8)
        for batch_idx, data in enumerate(self.train_loader, 0):
            # Train a batch
            loss = self.train_batch(data)

            # Update Progress Bar
            pbar_values = self._get_pbar_values(loss)
            pbar.update(batch_idx, values=pbar_values)

        # Update training history
        self.update_training_history(loss)
        pbar_values = self._get_pbar_values(loss)
        pbar.add(1, values=pbar_values)

    def validate(self, verbose=True):
        """Validate an epoch of model training.

        Args:
            verbose: Print validation loss and accuracy.
        """

        start_time = time.time()
        self.model.eval()
        val_loss = 0
        with torch.no_grad():
            for data in self.val_loader:
                inputs, targets = self.fetch_data(data)
                output = self.model(inputs)  # Get trained model output
                val_loss += self.calculate_criterion(output, targets, train=False).item()  # Sum up batch loss
                self._calculate_metrics(targets, output)  # Calculate evaluation metrics

        val_loss /= len(self.val_loader.dataset)
        self.val_losses.append(val_loss)

        for idx in range(len(self.metrics)):
            for metric in self.metrics[idx]:
                self.val_metrics[idx][metric].append(
                    self.metrics[idx][metric]['value']
                )
        end_time = time.time()

        # Time spent during validation
        duration = int(end_time - start_time)
        minutes = duration // 60
        seconds = duration % 60

        if verbose:
            log = f'Validation set (took {minutes} minutes, {seconds} seconds): Average loss: {val_loss:.4f}'
            for idx in range(len(self.metrics)):
                for metric in self.metrics[idx]:
                    log += f', {metric}: {self.metrics[idx][metric]["value"]}'
            log += '\n'
            print(log)

    def save_checkpoint(self, epoch=None):
        """Save model checkpoint.

        Args:
            epoch (int, optional): Current epoch number.
                (default: None)
        """
        if not self.checkpoint is None:
            metric = None
            if self.checkpoint.monitor == 'train_loss':
                metric = self.train_losses[-1]
            elif self.checkpoint.monitor == 'val_loss':
                metric = self.val_losses[-1]
            elif self.metrics:
                if self.checkpoint.monitor.startswith('train_'):
                    if self.record_train:
                        metric = self.train_metrics[
                            self.checkpoint.monitor.split('train_')[-1]
                        ][-1]
                else:
                    metric = self.val_metrics[0][
                        self.checkpoint.monitor.split('val_')[-1]
                    ][-1]
            else:
                print('Invalid metric function, can\'t save checkpoint.')
                return

            self.checkpoint(self.model, metric, epoch)

    def fit(self, start_epoch=1):
        """Perform model training.

        Args:
            start_epoch (int, optional): Start epoch for training.
                (default: 1)
        """

        self.reset_history()
        for epoch in range(start_epoch, start_epoch + self.epochs):
            print(f'Epoch {epoch}:')

            # Train an epoch
            self.train_epoch()
            self._reset_metrics()

            # Validate the model
            if not self.val_loader is None:
                self.validate()
                self._reset_metrics()

            # Save model checkpoint
            self.save_checkpoint(epoch)

            # Call Reduce LR on Plateau
            if not self.lr_schedulers['lr_plateau'] is None:
                self.lr_schedulers['lr_plateau'].step(self.val_losses[-1])
