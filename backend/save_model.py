import tensorflow as tf

# Load the model
model = tf.keras.models.load_model("emotion_model.h5")

# Export as SavedModel format
model.export("saved_model")
print("✅ Model exported in 'saved_model' format")
