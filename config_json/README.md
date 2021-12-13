# Config JSON Setup

The project uses **four** `json` files througout the flow to ensure smooth communication among different components.

- **`status.json`**: Stores information about the state of the training server and whether the project is currently in _dev_ or _live_ mode.
- **`cleanup.json`**: Contains a flag depending upon which the `clean` lambda function in the [inference](../inference/) module performs S3 cleanup.
- **`training.json`**: Stores training configuration which includes model parameters and dataset.
- **`inference.json`**: Keeps information regarding the models which are currently available for inference.

In case your are interested, sample preview for each JSON file has been provided. Check the contents of this directory to view the format of those files.

## Setup Instructions

This section will explain how the config files are initialized and setup for use in the project.

- Create a S3 bucket
- Inside the bucket, create the following folders
  - _training_
  - _imageclassification_
  - _textclassification_
- Read through the sections below to setup each of the config file
  - _Location_ refers to the path of the file relative to the root of S3
  - _Initial Content_ refers to the content that should be stored inside the file before uploading to S3

### Status

The config file contains the following keys

- **`status`**: Can be either `active` or `sleeping`. If the value is set to `active`, it means that the training server is currently busy and it won't accept any more training requests for the time being.
- **`token`**: If the status is active then this key will hold the token of the user whose model is currently being trained on the server.
- **`task_type`**: Can be either `imageclassification` or `textclassification`. If the status is active then it will store the type of the task that is currently being trained on the server.
- **`dev_mode`**: Can be a _boolean_ value. If it is set to true then the platform will halt all operations. This key is set to true only when any maintainence work has to be done.

[Click here](status.json) to check a sample preview of status.json

#### Location

`status.json`

#### Initial Content

```
{
  "status": "sleeping",
  "token": "",
  "task_type": "",
  "dev_mode": false
}
```

### Cleanup

The config file contains the following keys

- **`status`**: Can be either `active` or `sleeping`. If the value is set to `sleeping`, the cleanup lambda function won't delete old models from S3.

[Click here](cleanup.json) to check a sample preview of cleanup.json

#### Location

`cleanup.json`

#### Initial Content

```
{
  "status": "active"
}
```

### Inference

At the top level, this config file contains the tokens of the models available for inference as keys. For each token, the file has the following set of keys

- **`task_type`**: Can be either `imageclassification` or `textclassification`. It determines the model type.
- **`model_filename`**: Path of the _.pt_ (trained model) file in the S3 bucket.
- **`model_filename_onnx`**: Path of the _.onnx_ (trained model) file in the S3 bucket.
- **`classes`** or **`metadata_filename`**: The name of this key depends upon the model type. If the model is an image classification model then the name will be `classes` else if the model belongs to text classification then the name will be `metadata_filename`
- **`downloadable`**: Shows whether the model weights can be downloaded.
- **`accuracy`**: Represents the best accuracy of the model on validation dataset.
- **`accuracy_plot`**: Stores the _base64_ string of the accuracy chart plot created during the training process.
- **`created`**: Stores the date and time when the model was created and made available for inference.

[Click here](inference.json) to check a sample preview of inference.json

#### Location

`inference.json`

#### Initial Content

```
{}
```

### Training

The config file contains the following keys

- **`token`**: Token assigned to the user so that he can access the model after it has been deployed.
- **`task_type`**: Can be either `imageclassification` or `textclassification`. It determines the model type.
- **`num_classes`**: Total number of classes present in the dataset.
- **`optimizer`**: Optimizer for training.
- **`learning_rate`**: Learning rate for the optimizer.
- **`batch_size`**: Batch size to use for training.
- **`epochs`**: Number of epochs for which the model will be trained.
- **`data_split`**: Ratio at which the dataset will be split into training and validation set.
- **`dataset`**: Dataset to be used to training in the form of _base64_ strings.
- **`model`**: Model type.
- **`reduce_lr_on_plateau`**: Whether to add reduce LR on plateau scheduler to the training process
  - **`factor`**: Factor at which the learning rate will be reduced.
  - **`patience`**: How many epochs to wait for before reducing the learning rate.
  - **`min_lr`**: Minimum value to which the learning rate can be reduced.

[Click here](training.json) to check a sample preview of training.json

You don't need to create this file. It will be automatically created by the [training server](../train_config/training_server/) module.
