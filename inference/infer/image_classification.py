import io
import base64
from torchvision import transforms
from PIL import Image


def transform_image(b64_image):
    """Apply transformations to an input image."""
    try:
        transformations = transforms.Compose([
            transforms.Resize(255),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        image = Image.open(io.BytesIO(base64.b64decode(b64_image)))
        image = image.convert('RGB')
        return transformations(image).unsqueeze(0)
    except Exception as e:
        print(repr(e))
        raise(e)


def get_prediction(model, b64_image):
    """Get predictions for an image."""
    tensor = transform_image(b64_image)
    print('Picture transformed')
    return model(tensor).argmax().item()


def classify_image(model, b64_image, classes):
    prediction = get_prediction(model, b64_image)
    return classes[prediction]
