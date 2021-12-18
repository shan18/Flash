# Human Pose Estimation

To deploy a human pose estimation model on lambda, first we need to generate the model weights in ONNX format. Follow the steps below to get the ONNX version of the human pose estimation model. After generating the model, follow the steps mentioned in the [lambda README](lambda_config/README.md) to deploy the model on AWS Lambda.

## Setup Instructions

To run the pose estimation script follow the steps below:

- Install requirements  
  `pip install -r requirements.txt`
- Download the pre-trained pose estimation model (`pose_resnet_50_256x256.pth.tar`) from [here](https://drive.google.com/drive/folders/1g_6Hv33FG6rYRVLXx1SZaaHj871THrRW) and move it to the _models_ directory.
- Run the pose estimation script  
  `python3 pose_estimation.py --image <path to image>`

To convert the model to **ONNX**, use the `--convert` flag, it will save the model in the onnx format.  
`python3 pose_estimation.py --image <path to image> --convert`
