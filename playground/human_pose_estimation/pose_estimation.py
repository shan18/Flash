import os
import argparse
import cv2
import numpy as np
from PIL import Image

from model import Model


def draw_pose(model, key_points, image_array, output_shape, threshold):
    is_joint_plotted = [False for i in range(len(model.joints))]
    for pose_pair in model.pose_pairs:
        from_j, to_j = pose_pair

        from_thr, (from_x_j, from_y_j) = key_points[from_j]
        to_thr, (to_x_j, to_y_j) = key_points[to_j]

        image_height, image_width, _ = image_array.shape

        from_x_j, to_x_j = from_x_j * image_width / output_shape[0], to_x_j * image_width / output_shape[0]
        from_y_j, to_y_j = from_y_j * image_height / output_shape[1], to_y_j * image_height / output_shape[1]

        from_x_j, to_x_j = int(from_x_j), int(to_x_j)
        from_y_j, to_y_j = int(from_y_j), int(to_y_j)

        if from_thr > threshold and not is_joint_plotted[from_j]:
            # this is a joint
            cv2.ellipse(image_array, (from_x_j, from_y_j), (4, 4), 0, 0, 360, (255, 255, 255), 30, cv2.FILLED)
            is_joint_plotted[from_j] = True

        if to_thr > threshold and not is_joint_plotted[to_j]:
            # this is a joint
            cv2.ellipse(image_array, (to_x_j, to_y_j), (4, 4), 0, 0, 360, (255, 255, 255), 30, cv2.FILLED)
            is_joint_plotted[to_j] = True

        if from_thr > threshold and to_thr > threshold:
            # this is a joint connection, plot a line
            cv2.line(image_array, (from_x_j, from_y_j), (to_x_j, to_y_j), (0, 0, 255), 12)
            
    return Image.fromarray(image_array)


def main(config_file, model_path, image_file, threshold, convert=False):
    if model_path.endswith('.onnx'):
        model = Model(model_path)
    else:
        model = Model(model_path, config_file)
        if convert:
            model.convert_to_onnx('hpe_onnx.onnx')

    image = Image.open(image_file)
    pose_layers = model(image)
    key_points = [
        [x[1], x[3]]
        for x in [cv2.minMaxLoc(pose_layer) for pose_layer in pose_layers]
    ]  # [threshold, (x, y)]

    pose_image = draw_pose(model, key_points, np.array(image), pose_layers.shape[1:], threshold)
    pose_image.save(f'hpe_output.jpg')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-c', '--config', default='resnet50/256x256_d256x3_adam_lr1e-3.yaml',
        help='MPII config file path'
    )
    parser.add_argument(
        '-m', '--model', default='models/pose_resnet_50_256x256.pth.tar',
        help='Model file path'
    )
    parser.add_argument(
        '--convert', action='store_true',
        help='If model is in torch format, convert it to onnx.'
    )
    parser.add_argument(
        '--threshold', type=float, default=0.8,
        help='Threshold value for joints estimation'
    )
    parser.add_argument(
        '-i', '--image', required=True,
        help='Path to image'
    )
    args = parser.parse_args()

    main(args.config, args.model, args.image, args.convert, args.threshold)
