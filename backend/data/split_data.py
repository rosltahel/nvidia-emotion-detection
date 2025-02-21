import os
import shutil
import random

def split_train_validation(train_dir, val_dir, split_ratio=0.2):
    if not os.path.exists(val_dir):
        os.makedirs(val_dir)

    for class_name in os.listdir(train_dir):
        class_train_path = os.path.join(train_dir, class_name)
        class_val_path = os.path.join(val_dir, class_name)

        if not os.path.exists(class_val_path):
            os.makedirs(class_val_path)

        images = os.listdir(class_train_path)
        num_val = int(len(images) * split_ratio)

        val_images = random.sample(images, num_val)
        for img in val_images:
            shutil.move(os.path.join(class_train_path, img), os.path.join(class_val_path, img))

# Run the function
split_train_validation("data/train", "data/validation")
print("✅ Validation set created successfully!")
