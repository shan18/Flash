# Flash Training Lambda

This submodule contains the code for AWS lambda used to trigger the training process and check server status.

## Code Structure

The training lambda submodule contains four lambda functions

1. **`status`**: Fetches the `status.json` file from S3 and confirms the availability of the server
2. **`train`**: Receives the training configuration from frontend, validates the dataset and stores it in `training/training.json` in S3
3. **`start`**: Turns on the EC2 training server
4. **`stop`**: Turns off the EC2 training server and changes the status to _sleeping_ in `status.json`

## How it Works

- The **`status`** function upon invocation by the frontend, fetches `status.json` from S3 and returns the availability status of the training server.
- If the status is sleeping, frontend sends the training configuration along with the dataset to **`train`** function.
- **`train`** first updates the server status in `status.json` to _active_ then reads the training configuration, validates the dataset and creates the `training.json` file on S3.
- As soon as the `training.json` config file is **created**, an S3 event notification is triggerd which invokes the **`start`** lambda function.
- **`start`** fetches _status.json_ and checks the `dev_mode` flag. If `dev_mode` is set to `False`, then depending upon the task type, the corresponding EC2 instance is turned **on**.
- After training is completed, the training server deletes the training config (`training.json`) file from S3.
- As soon as the `training.json` config file is **deleted**, an S3 event notification is triggerd which invokes the **`stop`** lambda function.
- **`stop`** fetches _status.json_ and checks the `dev_mode` flag. If `dev_mode` is set to `False`, then depending upon the task type, the corresponding EC2 instance is turned **off**. It then updates the status in `status.json` to _sleeping_.

## Setup Instructions

- If not setup already, setup serverless on your system. For reference, check [this link](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
- Rename the `credentials-sample.yml` file to `credentials.yml` and fill the values of the properties with your own configuration.
- To deploy the lambda, run: `npm run deploy`
