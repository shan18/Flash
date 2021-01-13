# Flash Training

Page Link: https://shan18.github.io/Flash/training

This directory contains the code for the training section of the platform.

### Tech Stack

- AWS Lambda
- Serverless
- AWS S3
- AWS EC2
- PyTorch
- Torchvision
- Torchtext

## Code Structure

The training module contains 2 sub-modules

1. **`lambda`**: Manages EC2 instances and acts as an interface between the frontend and the training process
2. **`training server`**: Trains and deploys the model for inference

For instructions on setting up the individual sub-modules, please refer to the README in the [lambda_config](lambda_config/README.md) and [training_server](training_server/README.md) directory.

## How it works

- Then frontend invokes **`check`** when user submits a token.
- **`check`** fetches the `inference.json` file from S3 and confirms the validity of the token.
- If the token is valid, the frontend invokes **`infer`**.
- Using the token, **`infer`** fetches the required configuration from `inference.json` and gives model prediction.

**`clean`** is and independent function which runs every two hours. It checks for models which are more than two hours old (using the `created` key in `inference.json`) and deletes them.

## Setup Instructions

If you want to setup your own inference platform, follow the steps below:

_Note: Before beginning the setup, make sure that you have already followed and completed the instruction given at the [config json page](../config_json/README.md#Setup-Instructions)_

- Setup serverless on your system. For reference, check [this link](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
- Rename the `credentials-sample.yml` file to `credentials.yml` and fill out your bucket and region information in that file.

This directory contains the code use to train new models.

Download en for spacy
`python3 -m spacy download en`

Crontab

```
@reboot /home/ubuntu/start_flash.sh
*/30 * * * * /root/idle_check.sh
```
