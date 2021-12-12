# Flash Training

Page Link: https://shan18.github.io/Flash/training

This directory contains the code for the training section of the platform. For training, the project uses two EC2 instances: `p3.2xlarge` and `t3.2xlarge`. This is because, image classification trains very slow on a CPU instance so in order to minimize AWS costs, only the image classification task is trained on a GPU server while text classification is trained on a CPU instance.

### Tech Stack

- AWS Lambda
- Serverless
- AWS S3
- AWS EC2
- PyTorch
- Torchvision
- Torchtext

## Code Structure

The training module contains 2 submodules

1. **`lambda`**: Manages EC2 instances and acts as an interface between the frontend and the training process
2. **`training server`**: Trains and deploys the model for inference

## How it works

### Training Lambda

To see how the training lambda submodule works, check the [lambda_config](lambda_config/README.md#How-it-Works) section.

### Training Server

As soon as the server boots up, cron calls the `start_flash.sh` script to start the training process. To see how the training_server submodule works, check the [training_server](training_server/README.md#How-it-Works) section.

## Setup Instructions

_Note: Before beginning the setup, make sure that you have already followed and completed the instruction given at the [config json module](../config_json/README.md#Setup-Instructions)_

If you want to setup your own training platform, follow the steps below

1. Setup a lambda function which will manage the training servce. Instructions for setting up the lambda can be found in the [lambda_config](lambda_config/README.md#Setup-Instructions) section.
2. Create two EC2 instances
   - `p3.2xlarge` with Deep Learning Base AMI (Ubuntu 18.04) and 50 GB SSD storage
   - `t3.2xlarge` with Ubuntu Server 20.04 LTS (HVM), SSD Volume Type AMI and 16 GB SSD storage
3. Setup AWS credentials on the system to use boto3
   - Go to home folder  
     `$ cd ~`
   - Create required files and directories
     ```
     $ mkdir .aws
     $ touch .aws/config
     $ touch .aws/credentials
     ```
   - Update the `config` file with the following content (Replace `<your_aws_region>` with your preferred aws region)
     ```
     [default]
     region=<your_aws_region>
     output=text
     ```
   - Update the `credentials` file with the following content (Replace `<iam_access_id>` and `<iam_secret_access_key>` with the access id and secret access key of your IAM user)
     ```
     [default]
     aws_access_key_id=<iam_access_id>
     aws_secret_access_key=<iam_secret_access_key>
     ```
4. Install packages and the setup the training code on both the instances. For instructions on how to setup the servers, check the [training_server](training_server/README.md#Setup-Instructions) section.
5. After the instances are setup, copy the file `start_flash.sh` to both the servers and update the path to the training_server code in the file with the path to your code on the instance.
6. Replace the name `ubuntu` in the script `idle_check.sh` with the username you are using to login to the server. Then copy this script to the server.
7. Now setup two cron jobs which will automatically start the training process and constantly check server utilization so that if the server is not in use, it can be automatically shutdown to reduce cost. To setup crons
   - `$ sudo crontab -e`
   - After running the command above it will give you a list of editors. Choose your favourite editor.
   - Add these lines to the end of the file
     ```
     @reboot <path to your start_flash.sh script>
     */30 * * * * <path to idle_check.sh script>
     ```
