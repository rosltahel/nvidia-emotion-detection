import onnx

# Load the ONNX model
onnx_model = onnx.load("emotion_model.onnx")

# Check if the model is valid
onnx.checker.check_model(onnx_model)
print("ONNX model is valid!")
