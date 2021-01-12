# Flash Inference

Page Link: https://shan18.github.io/Flash/inference

This directory contains the code for the inference section of the platform.

### Tech Stack

- AWS Lambda
- Serverless
- AWS S3
- PyTorch
- Torchvision

## Code Structure

The inference module contains **3 lambda functions**

1. **check**: Checks if the token submitted by the user is valid.
2. **infer**: Performs inference. It takes in the input and returns the model prediction.
3. **clean**: Runs every two hours and deletes those models from the server which have expired their validity (i.e. models which are older than two hours).

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
