import onnxruntime as ort
import numpy as np
import cv2

# Load ONNX model
session = ort.InferenceSession("emotion_model.onnx")

# Load an actual image
img = cv2.imread("s.jpg", cv2.IMREAD_GRAYSCALE)
img = cv2.resize(img, (48, 48)).astype(np.float32) / 255.0  # Normalize
img = np.expand_dims(img, axis=(0, -1))  # Add batch & channel dimensions

# Get model input name
input_name = session.get_inputs()[0].name

# Run inference
outputs = session.run(None, {input_name: img})

# Map output to emotion label
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']
predicted_emotion = emotion_labels[np.argmax(outputs[0])]

print("Predicted Emotion:", predicted_emotion)
