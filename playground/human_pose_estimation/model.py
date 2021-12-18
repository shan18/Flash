import os
import sys
from PIL import Image
import numpy as np
import torch
import torch.onnx
from torchvision import transforms
import onnx
import onnxruntime
from onnxruntime.quantization import quantize
from onnxruntime.quantization import QuantizationMode

HPE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pose')
HPE_LIB_PATH = os.path.join(HPE_PATH, 'lib')
MPII_CONFIG_ROOT = os.path.join(HPE_PATH, 'experiments', 'mpii')

if not HPE_LIB_PATH in sys.path:
    sys.path.insert(0, HPE_LIB_PATH)

import models
from core.config import config, update_config


class Model:

    def __init__(self, model_path, config_file=None):
        self.model_path = model_path
        if self.model_path.endswith('.onnx'):
            self._is_onnx = True
        else:
            self.config_file = config_file
            self._is_onnx = False
            self._setup_config()

        self._define_pose_constants()
        self._load_model()
        self._define_transforms()

    def _define_pose_constants(self):
        self.pose_pairs = [
            [9, 8], [8, 7], [7, 6], [6, 2], [2, 1], [1, 0], [6, 3], [3, 4],
            [4, 5], [7, 12], [12, 11], [11, 10], [7, 13], [13, 14], [14, 15]
        ]
        self.joints = [
            'right_ankle', 'right_knee', 'right_hip', 'left_hip', 'left_knee',
            'left_ankle', 'pelvis', 'thorax', 'upper_neck', 'head_top', 'right_wrist',
            'right_elbow', 'right_shoulder', 'left_shoulder', 'left_elbow', 'left_wrist'
        ]
        self.joints_idx = {v: i for i, v in enumerate(self.joints)}

    def _setup_config(self):
        if not self.config_file.startswith(MPII_CONFIG_ROOT):
            self.config_file = os.path.join(
                MPII_CONFIG_ROOT, '/'.join(self.config_file.split('/')[-2:])
            )
        update_config(self.config_file)
        config.GPUS = ''  # CPU only

    def _load_model(self):
        if self._is_onnx:
            self._model = onnxruntime.InferenceSession(self.model_path)
        else:
            self._model = eval(f'models.{config.MODEL.NAME}.get_pose_net')(config, is_train=False)
            self._model.load_state_dict(torch.load(self.model_path, map_location=torch.device('cpu')))

    def _define_transforms(self):
        self._transform = transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def _to_numpy(self, tensor):
        return tensor.detach().cpu().numpy() if tensor.requires_grad else tensor.cpu().numpy()

    def _quantize_onnx(self, filename):
        onnx_model = onnx.load(filename)
        onnx.checker.check_model(onnx_model)
        quantized_model = quantize(
            onnx_model,
            quantization_mode=QuantizationMode.IntegerOps,
            static=False
        )
        onnx.save(quantized_model, filename)

    def convert_to_onnx(self, filename):
        # Input to the model
        model_input = torch.randn(1, 3, 256, 256, requires_grad=True)

        # Export the model
        torch.onnx.export(
            self._model,  # model being run
            model_input,  # model input (or a tuple for multiple inputs)
            filename,  # where to save the model (can be a file or file-like object)
            export_params=True,  # store the trained parameter weights inside the model file
            opset_version=10,  # the ONNX version to export the model to
            do_constant_folding=True,  # whether to execute constant folding for optimization
            input_names = ['input'],  # the model's input names
            output_names = ['output'],  # the model's output names
            dynamic_axes={  # variable lenght axes
                'input': {0 : 'batch_size'},
                'output': {0 : 'batch_size'}
            }
        )

        # Quantize model
        self._quantize_onnx(filename)
        self.model_path = filename
        self._is_onnx = True

        # Load quantized model
        self._load_model()

    def load_image(self, image):
        if isinstance(image, str):
            image = Image.open(image)
        return self._transform(image).unsqueeze(0)

    def __call__(self, image):
        image = self.load_image(image)
        if self._is_onnx:
            image = self._to_numpy(image)
            model_input = {self._model.get_inputs()[0].name: image}
            return self._model.run(None, model_input)[0][0]

        return self._model(image).squeeze(0).detach().numpy().copy()
