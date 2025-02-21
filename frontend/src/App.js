import React, { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { motion } from "framer-motion";
import { FaMoon, FaSun, FaCamera, FaFileImage } from "react-icons/fa";

const App = () => {
  const [useWebcam, setUseWebcam] = useState(false); // Toggle for webcam vs file upload
  const webcamRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // Show preview
    }
  };

  // Capture image from webcam
  const captureAndSend = useCallback(async () => {
    if (!webcamRef.current || !useWebcam) return;
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setLoading(true);
    try {
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const formData = new FormData();
      formData.append("image", blob, "snapshot.jpg");

      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEmotion(response.data.emotion);
    } catch (error) {
      console.error("Error detecting emotion:", error);
      setEmotion("Error");
    } finally {
      setLoading(false);
    }
  }, [useWebcam]);

  // Auto-capture images every 2 seconds if webcam is active
  useEffect(() => {
    if (useWebcam) {
      const interval = setInterval(captureAndSend, 2000);
      return () => clearInterval(interval);
    }
  }, [captureAndSend, useWebcam]);

  // Handle Form Submission (For Uploaded Image)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setLoading(true);
    setEmotion(null);

    const formData = new FormData();
    formData.append("image", e.target.image.files[0]);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEmotion(response.data.emotion);
    } catch (error) {
      console.error("Error detecting emotion:", error);
      setEmotion("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen flex flex-col items-center justify-center p-6 transition-all`}>
      
      {/* Dark Mode Toggle */}
      <button
        className="absolute top-4 right-6 p-3 rounded-full bg-gray-800 text-white shadow-md hover:scale-110 transition-all"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
      </button>

      <motion.div 
        className="max-w-lg w-full p-6 rounded-xl shadow-lg bg-white/20 backdrop-blur-md border border-gray-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1 
          className="text-4xl font-extrabold text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Emotion Detection
        </motion.h1>

        {/* Toggle for Webcam vs Image Upload */}
        <div className="flex justify-center space-x-4 mb-6">
          <button 
            className={`${useWebcam ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all`}
            onClick={() => setUseWebcam(true)}
          >
            <FaCamera /> Use Webcam
          </button>
          <button 
            className={`${!useWebcam ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"} flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-all`}
            onClick={() => setUseWebcam(false)}
          >
            <FaFileImage /> Upload Image
          </button>
        </div>

        {/* Webcam or File Upload Section */}
        {useWebcam ? (
          <div className="flex justify-center">
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-64 h-48 rounded-lg shadow-md border border-gray-300"
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center">
              {selectedImage && (
                <motion.img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-48 h-48 object-cover rounded-xl mx-auto shadow-md"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-4 mb-2 border border-gray-300 p-2 rounded-lg shadow-md cursor-pointer"
              />
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg w-full hover:from-indigo-600 hover:to-blue-500 transform hover:scale-105 transition-all"
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? "Detecting Emotion..." : "Detect Emotion"}
              </motion.button>
            </div>
          </form>
        )}

        {/* Loading Indicator */}
        {loading && (
          <motion.div 
            className="flex justify-center my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </motion.div>
        )}

        {/* Detected Emotion Display */}
        {emotion && (
          <motion.div 
            className="mt-6 text-center p-4 bg-white/30 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold">
              {emotion === "Happy" ? "😊" : emotion === "Sad" ? "😢" : "🤔"} {emotion}
            </h2>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default App;
