import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./utils/cropImage";
import axios from "axios";

const AvatarUploader = () => {
  const [image, setImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [previewUrl, setPreviewUrl] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const uploadCroppedImage = async () => {
    const canvas = await getCroppedImg(image, croppedAreaPixels);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("avatar", blob, "avatar.png");

      const token = localStorage.getItem("token");
      await axios.put("http://localhost:4000/api/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Avatar updated!");
    });
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {image && (
        <>
          <div className="relative w-64 h-64">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <button onClick={uploadCroppedImage}>Upload</button>
        </>
      )}
    </div>
  );
};

export default AvatarUploader;
