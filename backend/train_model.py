import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam

# Define image parameters
IMG_SIZE = (48, 48)
BATCH_SIZE = 64  # Increased batch size for stability
EPOCHS = 40  # Train for longer

# Load dataset
train_dir = "data/train"
val_dir = "data/validation"

# Data Augmentation (More aggressive)
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=30,       # Increased rotation for better augmentation
    width_shift_range=0.3,   # More shift to improve robustness
    height_shift_range=0.3,
    shear_range=0.3,
    zoom_range=0.3,
    horizontal_flip=True,
    brightness_range=[0.8, 1.2],  # Simulate different lighting
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    color_mode="grayscale",
    class_mode="categorical"
)

val_generator = val_datagen.flow_from_directory(
    val_dir,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    color_mode="grayscale",
    class_mode="categorical"
)

# Improved Model
model = Sequential([
    Conv2D(64, (3,3), activation='swish', input_shape=(48, 48, 1)),
    BatchNormalization(),
    MaxPooling2D(2, 2),
    Dropout(0.3),  # Increased dropout for regularization

    Conv2D(128, (3,3), activation='swish'),
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.3),

    Conv2D(256, (3,3), activation='swish'),
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.3),

    Conv2D(512, (3,3), activation='swish'),  # Added deeper layer
    BatchNormalization(),
    MaxPooling2D(2,2),
    Dropout(0.4),

    Flatten(),
    Dense(1024, activation='swish'),  # Increased neurons
    BatchNormalization(),
    Dropout(0.5),

    Dense(7, activation='softmax')
])

# Optimizer: Adam with learning rate decay
optimizer = Adam(learning_rate=0.0005)

model.compile(optimizer=optimizer, loss='categorical_crossentropy', metrics=['accuracy'])

# Callbacks
early_stopping = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True)
lr_reduction = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=4, min_lr=0.00001)

# Train the model
model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS,
    callbacks=[early_stopping, lr_reduction]
)

# Save the model
model.save("emotion_model_improved.h5")

print("Improved model training complete and saved as 'emotion_model_improved.h5'")
