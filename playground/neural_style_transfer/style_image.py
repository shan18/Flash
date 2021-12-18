import numpy as np
import torch
from torch.autograd import Variable
from PIL import Image

from model import Net
from style_map import STYLE_MAP


def tensor_load_rgbimage(image, size=None, scale=None, keep_asp=False):
    img = image.convert('RGB')
    if size is not None:
        if keep_asp:
            size2 = int(size * 1.0 / img.size[0] * img.size[1])
            img = img.resize((size, size2), Image.ANTIALIAS)
        else:
            img = img.resize((size, size), Image.ANTIALIAS)

    elif scale is not None:
        img = img.resize((int(img.size[0] / scale), int(img.size[1] / scale)), Image.ANTIALIAS)
    img = np.array(img).transpose(2, 0, 1)
    img = torch.from_numpy(img).float()
    return img


def preprocess_batch(batch):
    batch = batch.transpose(0, 1)
    (r, g, b) = torch.chunk(batch, 3)
    batch = torch.cat((b, g, r))
    batch = batch.transpose(0, 1)
    return batch


def tensor_save_rgbimage(tensor):
    img = tensor.clone().clamp(0, 255).numpy()
    img = img.transpose(1, 2, 0).astype('uint8')
    return Image.fromarray(img)


def tensor_save_bgrimage(tensor):
    (b, g, r) = torch.chunk(tensor, 3)
    tensor = torch.cat((r, g, b))
    return tensor_save_rgbimage(tensor)


def stylize(content_img, style_img_idx, content_size=256, style_size=256, model='msg.model', ngf=128):
    content_image = tensor_load_rgbimage(content_img, size=content_size, keep_asp=True)
    content_image = content_image.unsqueeze(0)
    
    style_img = Image.open(STYLE_MAP[style_img_idx])
    style = tensor_load_rgbimage(style_img, size=style_size)
    style = style.unsqueeze(0)    
    style = preprocess_batch(style)

    style_model = Net(ngf=ngf)
    model_dict = torch.load(model)
    model_dict_clone = model_dict.copy()
    for key, value in model_dict_clone.items():
        if key.endswith(('running_mean', 'running_var')):
            del model_dict[key]
    style_model.load_state_dict(model_dict, False)

    style_v = Variable(style)

    content_image = Variable(preprocess_batch(content_image))
    style_model.setTarget(style_v)

    output = style_model(content_image)
    return tensor_save_bgrimage(output.data[0])
