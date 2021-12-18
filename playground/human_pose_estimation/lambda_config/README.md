This directory contains the code to host a Human Pose Estimation model on AWS Lambda.

## Setup Instructions

- Generate a human pose estimation model in ONNX format with the instructions mentioned in the [human_pose_estimation README](../README.md).
- Rename the model to `human_pose_estimation.onnx` and put it in this directory.
- If not setup already, setup serverless on your system. For reference, check [this link](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
- To deploy the lambda, run: `npm run deploy`
