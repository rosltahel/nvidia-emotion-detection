import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const DragDropUpload = ({ onFileUpload }) => {
  const [preview, setPreview] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setPreview(URL.createObjectURL(file));
      onFileUpload(file);
    },
  });

  return (
    <div className="flex flex-col items-center p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-all" {...getRootProps()}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg" />
      ) : (
        <p className="text-gray-500">Drag & drop an image here, or click to select one</p>
      )}
    </div>
  );
};

export default DragDropUpload;
