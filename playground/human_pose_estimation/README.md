# Human Pose Estimation

This directory contains the code to host a Human Pose Estimation model on AWS Lambda.

## Setup Instructions

- Download the `human_pose_estimation.onnx` file from [this link](https://drive.google.com/drive/folders/1YcDNNTohHinVxB40Hugwxe1_OyUougs8?usp=sharing) and place it in this directory.
- If not setup already, setup serverless on your system. For reference, check [this link](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
- To deploy the lambda, run: `npm run deploy`
