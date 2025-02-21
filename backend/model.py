import cv2
import numpy as np

import tensorflow as tf

class EmotionRecognitionModel:
    def __init__(self, model_path):
        # Load the trained model
        self.model = tf.keras.models.load_model(model_path)

    def predict(self, image):
        # Preprocess image
        image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        image = cv2.resize(image, (48, 48))  # Resize to 48x48
        image = np.expand_dims(image, axis=-1)  # Add channel dimension
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        image = image / 255.0  # Normalize

        # Predict the emotion
        prediction = self.model.predict(image)
        predicted_class = np.argmax(prediction)

        emotion_classes = ['anger', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral']
        return emotion_classes[predicted_class]
