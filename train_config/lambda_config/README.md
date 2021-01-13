# Flash Training Lambda

This sub-module contains the code for AWS lambda used to trigger the training process and check server status.

## Code Structure

The training lambda sub-module contains four lambda functions

1. **`status`**: Fetches the `status.json` file from S3 and confirms the availability of the server.
2. **`train`**: Receives the training configuration from frontend, validates the dataset and stores it in `training/training.json` in S3
3. **`start`**:
4. **`stop`**:

## How it Works

## Setup Instructions

To setup your own training lambda
To use the code, rename the `credentials-sample.yml` file to `credentials.yml` and fill the values of the properties with your own configuration.
