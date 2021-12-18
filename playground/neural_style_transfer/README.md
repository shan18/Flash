# Neural Style Transfer

This directory contains the code to host a Neural Style Transfer model on AWS Lambda.

The model and the code is referenced from the [MSG-Net repository](https://github.com/StacyYang/MSG-Net).

## Setup Instructions

- Download the `msg.model` file from [this link](https://drive.google.com/drive/folders/1YcDNNTohHinVxB40Hugwxe1_OyUougs8?usp=sharing) and place it in this directory.
- If not setup already, setup serverless on your system. For reference, check [this link](https://www.serverless.com/framework/docs/providers/aws/guide/installation/)
- To deploy the lambda, run: `npm run deploy`
