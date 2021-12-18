import numpy as np
import onnx
import onnxruntime
from onnxruntime.quantization import quantize
from onnxruntime.quantization import QuantizationMode
import albumentations as A
from PIL import Image


class Model:

    def __init__(self, model_path):
        self.model_path = model_path
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

    def _load_model(self):
        self._model = onnxruntime.InferenceSession(self.model_path)
    
    def _define_transforms(self):
        self._transform = A.Compose([
            A.Resize(256, 256, always_apply=True),
            A.Normalize(
                mean=(0.485, 0.456, 0.406),
                std=(0.229, 0.224, 0.225),
                always_apply=True
            ),
        ])
    
    def _to_numpy(self, image):
        return np.expand_dims(
            np.transpose(image, (2, 0, 1)), axis=0
        )
    
    def __call__(self, image):
        image = self._to_numpy(
            self._transform(
                image=np.array(image, dtype=np.float32)
            )['image']
        )
        model_input = {self._model.get_inputs()[0].name: image}
        return self._model.run(None, model_input)[0][0]
