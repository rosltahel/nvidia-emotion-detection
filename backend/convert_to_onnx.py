import tensorflow as tf

# Try loading the model
try:
    model = tf.keras.models.load_model("emotion_model.h5")
    print("✅ Model loaded successfully!")
    print(f"Input Shape: {model.input_shape}")
    print(f"Output Shape: {model.output_shape}")
except Exception as e:
    print("❌ Error loading model:", e)
