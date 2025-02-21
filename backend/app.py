import cv2
import numpy as np
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model

app = Flask(__name__)

# Load model
model = load_model("emotion_model.h5")

# Define emotion labels
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Neutral", "Sad", "Surprise"]

@app.route("/predict", methods=["POST"])
def predict():
    try:
        file = request.files["image"].read()
        npimg = np.frombuffer(file, np.uint8)

        # Debug: Check if image is loaded correctly
        img = cv2.imdecode(npimg, cv2.IMREAD_GRAYSCALE)
        if img is None:
            print("Error: OpenCV failed to decode the image")
            return jsonify({"error": "Failed to decode image with OpenCV"})

        # Resize and normalize
        img = cv2.resize(img, (48, 48)) / 255.0
        img = np.expand_dims(img, axis=(0, -1))  # Reshape for model

        # Debug: Check the shape of the processed image
        print("Processed image shape:", img.shape)

        # Predict emotion
        preds = model.predict(img)
        
        # Debug: Print raw prediction values
        print("Raw Predictions:", preds)
        print("Argmax:", np.argmax(preds))

        emotion = EMOTIONS[np.argmax(preds)]
        print("Detected Emotion:", emotion)

        return jsonify({"emotion": emotion})

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
