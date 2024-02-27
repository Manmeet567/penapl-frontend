import React, { useState } from 'react';
import {MdOutlineClose} from 'react-icons/md';
import {TbCloudUpload} from 'react-icons/tb';
import axios from "axios";

function ImageUpload({setImageData, imageData}) {
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = async (e) => {
    e.preventDefault();

    if (isImageSelected) {
      return;
    }

    const image = e.dataTransfer.files[0];
    setLoading(true)
    if (image && image.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`);

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        const data = response.data;
        setImageData(data.secure_url);
      } catch (error) {
        setError('Image upload failed. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = async (e) => {
    if (isImageSelected) {
      return;
    }
    setLoading(true);
    const image = e.target.files[0];

    if (image && image.type.startsWith('image/')) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", `${import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET}`);

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        const data = response.data;
        setImageData(data.secure_url);
      } catch (error) {
        setError('Image upload failed. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const clearImage = () => {
    setImageData(null);
  };

  return (
    <div className="image-upload-container">
      {imageData ? (
        <div style={{marginTop:"10px", padding:"20px", minWidth:"500px", minHeight:"300px", border:"2px dashed #838383", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
          <div style={{padding:"10px", border:"1px solid #333"}}><img src={imageData} alt="Selected" style={{ height:"200px"}}/><MdOutlineClose onClick={clearImage} style={{position:"absolute", backgroundColor:"red", color:"#fff", borderRadius:"50%", padding:"5px", fontSize:"30px", cursor:"pointer", transform:"translate(-2px,-23px)"}}/></div>
          {/* <button onClick={clearImage}>Clear</button> */}
        </div>
      ) : (
        <label htmlFor="fileInput" className="drop-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div style={{marginTop:"10px", padding:"20px", maxWidth:"100%", height:"200px", border:"2px dashed #838383", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
            {!loading && <TbCloudUpload style={{fontSize:"40px", marginBottom:"20px"}}/>}
            {!loading && <p><b>Choose a file</b> or drag it here </p>}
            {loading && <p>Uploading . . .</p>}
          </div>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
        </label>
      )}
    </div>
  );
}

export default ImageUpload;
