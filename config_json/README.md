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
  - _classification_
  - _sentimentanalysis_
- Read through the sections below to setup each of the config file
  - _Location_ refers to the path of the file relative to the root of S3
  - _Initial Content_ refers to the content that should be stored inside the file before uploading to S3

### Status

#### Location

`status.json`

#### Content

```
{
  "status": "sleeping",
  "token": "",
  "task_type": "",
  "dev_mode": false
}
```

### Cleanup

#### Location

`cleanup.json`

#### Content

```
{
  "status": "active"
}
```

### Inference

#### Location

`inference.json`

#### Content

```
{}
```

### Training

You don't need to create this file. It will be automatically created by the [training server](../train_config/model_training/) module.
