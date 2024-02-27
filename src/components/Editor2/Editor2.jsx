import { useState, useRef, useEffect } from "react";
import Editor from "./Editor";
import './HTMLContent.css';
import Navbar from '../Navbar/Navbar';
import { PiImageLight } from "react-icons/pi";
import {Button, Box, Chip, CircularProgress} from '@mui/material';
import { convertJsonToHtml } from "../../utils/jsonToHtml";
import { toast } from "react-toastify";
import Modal from '@mui/material/Modal';
import { blog_tags } from "../../utils/blogTags";
import {MdOutlineClose} from 'react-icons/md';
import { useAuthContext } from "../../hooks/useAuthContext";  
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import {PiHeartBold} from 'react-icons/pi';
import {FacebookShareButton, FacebookIcon ,TwitterShareButton,  RedditShareButton, RedditIcon, LinkedinShareButton, LinkedinIcon} from 'react-share';
import {FaXTwitter} from 'react-icons/fa6';
import {IoLinkSharp} from 'react-icons/io5';
import { IoMdClose } from "react-icons/io";
import NewComments from "../Comments/NewComments";
import PreviewBlog from "../PreviewBlog/PreviewBlog";


// Initial Data
const INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      id:"editor_initialized",
      type: "paragraph",
      data: {
        text: "Tell your story..."
      },
    },
  ],
};

// const INITIAL_DATA = {"time":1699423498457,"blocks":[{"id":"editor_initialized","type":"paragraph","data":{"text":"Testing text"}},{"id":"MFptxQxBEJ","type":"image","data":{"url":"https://d138zd1ktt9iqe.cloudfront.net/media/seo_landing_files/file-istockphoto-859550894-170667a-1600430313.jpg","caption":"hadfha","withBorder":false,"withBackground":false,"stretched":false}},{"id":"Zj3kcxyqHG","type":"list","data":{"style":"ordered","items":["afdga","afdg","adf","ga","dfg","afdha"]}}],"version":"2.28.2"}

const headingStyles = {
  fontSize: "2rem",
  fontWeight: "700",
  lineHeight: "1.4",
  color: "#000",
  border: "none",
  outline: "none",
  width: "100%",
  wordWrap: "break-word",
  overflow: "hidden",
  resize: "none",
  height:"60px"
};

function Editor2() {
  const { userData } = useAuthContext();
  const [data, setData] = useState(INITIAL_DATA);
  const [open, setOpen] = useState(false);
  const [tagsModal,setTagsModal] = useState(false);
  const [uploadFromDevice, setUploadFromDevice] = useState(false);
  const [blogTitle,setBlogTitle] = useState('');
  const [imageData, setImageData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [blogData, setBlogData] = useState('')
  const [preview, setPreview] = useState(false);
  const navigate = useNavigate();

  const textareaRef = useRef(null);

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  useEffect(() => {toast.error(error)}, [error])

  useEffect(() => {setBlogData(convertJsonToHtml(data))}, [data])  



  // useEffect(() => {console.log(data)}, [data])

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && customTag.trim() !== "") {
      if (!tags.includes(customTag)) {
        if (tags.length < 5) {
          setTags((prevTags) => [...prevTags, customTag]);
          setCustomTag("");
        } else {
          toast.error("Can't add more than 5 tags.")
        }
      }else{
        toast.error("Can't add the same tag again.")
      }
    }
  };
  
  const handleAddTag = () => {
    if (customTag.trim() !== "") {
      if (!tags.includes(customTag)) {
        if (tags.length < 5) {
          setTags((prevTags) => [...prevTags, customTag]);
          setCustomTag("");
        } else {
          toast.error("Can't add more than 5 tags.")
        }
      } else{
        toast.error("Can't add the same tag again.")
      }
    }
  }
  

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTagsModalOpen = () => setTagsModal(true);
  const handleTagsModalClose = () => setTagsModal(false);

  const handleFileInput = async (e) => {
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

  const filterSuggestedTags = (input) => {
    const filteredTags = blog_tags.filter((tag) =>
      tag.toLowerCase().includes(input.toLowerCase())
    );

    return filteredTags;
  };

  const handleCustomTagChange = (e) => {
    const input = e.target.value;
    setCustomTag(input);
    const newSuggestedTags = filterSuggestedTags(input);

    if (input && customTag) {
      setSuggestedTags(newSuggestedTags);
    } else {
      setSuggestedTags([]);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    setTags(updatedTags);
  };

  const clearImage = () => {
    setImageData(null);
  };


  const handleSubmit = async () => {
    if (!blogTitle) {
      toast.error("Blog title is required");
      return;
    }
  
    if (!blogData) {
      toast.error("Blog content is required");
      return;
    }
  
    if (!tags || tags.length === 0) {
      toast.error("At least one tag is required");
      return;
    }
  
    if (tags.length > 5) {
      toast.error("Only 5 tags are allowed");
      return;
    }
  
    if (!imageData) {
      toast.error("Cover image is required");
      return;
    }
  
    const blog = {
      blogTitle: blogTitle,
      blogData: JSON.stringify(data),
      author: userData.user.username,
      tags: tags,
      cover_image_url: imageData
    };
  
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/createBlog`,
        blog,
        {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        console.log(response.data);
        setBlogData("");
        setBlogTitle("");
        setTags([]);
        setImageData(null);
        navigate(`/blog/${response.data.slug}`);
        toast.success("Blog Created Successfully");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("An error occurred while creating the blog");
    }
  };
  


  return (
    <>
    <Navbar />
    <div className="editor" style={{width:"650px", margin:"0 auto", paddingTop:"110px"}}>
    <div
          className="header-editor-options"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            className="heo-header"
            style={{ display: "flex", alignItems: "center" }}
          >
            {!preview && <Box
              className="add-cover-image"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                cursor: "pointer",
                padding: "3px 10px",
              }}
              onClick={handleOpen}
            >
              <PiImageLight style={{ marginRight: "5px", fontSize: "20px" }} />
              <span>Add cover image</span>
            </Box>}
            {preview && <Box
              className="preview-mode"
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                padding: "3px 15px",
                backgroundColor:"rgba(166, 213, 255, 0.418)",
                borderRadius:"50px",
              }}
            >
              <span>You are in Preview mode</span>
            </Box>}
          </div>

          <div className="heo-preview-options">
            <Button variant="outlined" sx={{ borderRadius: "50px" }} onClick={() => setPreview(prev => !prev)}>
              {preview ? "Edit Blog" : "Preview"}
            </Button>
            {!preview && <Button
              variant="contained"
              sx={{ borderRadius: "50px", marginLeft: "10px" }}
              onClick={handleTagsModalOpen}
            >
              Publish
            </Button>}
          </div>
        </div>

      {preview && <PreviewBlog blogTitle={blogTitle} imageData={imageData} blogData={blogData} tags={tags} preview={preview}/>}


      {!preview && <div style={{margin:"40px 0"}}>
        <div className="title-input">
          <textarea
                ref={textareaRef}
                type="text"
                placeholder="Title..."
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
                style={headingStyles}
                onInput={handleTextareaInput}
          />
        </div>

        {imageData && <div style={{ position: "relative" }}>
          <img
            src={imageData}
            alt="Image not found"
            style={{ width: "100%", maxHeight: "700px", margin: "20px 0" }}
          />
          <div>
            <IoMdClose
              onClick={() => setImageData(null)}
              style={{
                fontSize: "30px",
                backgroundColor: "#fb2828",
                color: "#fff",
                borderRadius: "50%",
                padding: "2px",
                position: "absolute",
                top: "5px",
                right: "-10px",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
        }


        <Editor style={{margin:"20px 0"}} data={data} onChange={setData} editorblock="editorjs-container" />
      </div>}
      
      {/* {data && <div dangerouslySetInnerHTML={{ __html: blogData }}></div>} */}
      {/* {data && <div>{JSON.stringify(data)}</div>} */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display:"flex",
          justifyContent:"center"
        }}
      >
        <Box sx={{
          width:"500px", 
          height: uploadFromDevice ? "420px" : "300px",
          marginTop:"80px",
          backgroundColor:"#fff",
          border:"none",
          outline:"none",
          borderRadius:"8px",
          padding:"20px"
        }}>
          <h2>Upload Cover Image</h2>
          <hr style={{margin:"8px 0"}} />
          {!uploadFromDevice && <><div className="img-blg-link" style={{display:"flex", flexDirection:"column"}}>
            <label>Enter image Url:</label>
            <input value={imageData} onChange={(e) => {setImageData(e.target.value)}} type="url" style={{margin:"10px 0 0", padding:"5px", outline:"none"}} />
          </div>

          <p style={{textAlign:"center", margin:"20px 0"}}>OR</p>
          
          <div className="select-from-device">
            <Button variant="contained" sx={{width:"100%"}} onClick={() => setUploadFromDevice(true)}>Upload From Device</Button>
          </div></>}

          {uploadFromDevice && <div style={{margin:"20px 0 0"}}>
            {loading && <CircularProgress />}
            {!imageData && !loading && <input type="file" onChange={handleFileInput} accept="image/*" />}
            {imageData && <div style={{ minWidth:"300px", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
            <div style={{padding:"10px", border:"1px solid #333"}}><img src={imageData} alt="Selected" style={{ height:"200px"}}/><MdOutlineClose onClick={clearImage} style={{position:"absolute", backgroundColor:"red", color:"#fff", borderRadius:"50%", padding:"5px", fontSize:"30px", cursor:"pointer", transform:"translate(-2px,-23px)"}}/></div>
          </div>}
            <hr style={{margin:"20px 0 0"}} />
          </div>}


          <div style={{width:"100%", display:"flex", justifyContent:"flex-end"}}>
            {uploadFromDevice && <Button variant="contained"  sx={{margin:"20px 0 10px", marginRight:"20px"}}  onClick={() => setUploadFromDevice(false)}>Add using Url</Button>}
            <Button variant="outlined" sx={{margin:"20px 0 10px"}} onClick={handleClose}>Cancel</Button>
          </div>
        </Box>
      </Modal>


      <Modal 
        open={tagsModal}
        onClose={handleTagsModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{
          display:"flex",
          justifyContent:"center"
        }}>
          <Box
            sx={{
              width:"500px",
              backgroundColor:"#fff",
              borderRadius:"8px",
              border:"none",
              outline:"none",
              height:"300px",
              padding:"20px",
              margin:"100px 0"
            }}

          >
            <h2>Final Touches</h2>
            <hr style={{margin:"8px 0"}}/>
            <p style={{marginBottom:"10px"}}>Add tags to your blog</p>
            <div style={{display:"flex"}}>
              <input
                type="text"
                placeholder="Enter Tags"
                value={customTag}
                onChange={handleCustomTagChange}
                style={{
                  padding:"5px",
                  outline: "none",
                  width:"100%",
                  border:"1px solid #000",
                  borderRadius:"4px"
                }}
                onKeyPress={handleKeyPress}
              />
              <Button sx={{marginLeft:"10px"}} size="small" variant="contained" onClick={handleAddTag}>Add</Button>
            </div>

            {suggestedTags?.length > 0 && (
            <Box
              sx={{
                width: "250px",
                maxHeight: "120px",
                height:"auto",
                boxShadow: "5px 10px 15px rgba(0,0,0,0.3)",
                borderRadius: "10px",
                padding: "10px",
                overflow: "auto",
                marginTop: "10px",
              }}
            >
              {suggestedTags?.map((tag, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!tags.includes(tag)) {
                      if (tags.length < 5) {
                        // Check if the tag is not already in tags and if there are less than 5 tags
                        setTags((prevTags) => [...prevTags, tag]);
                        setCustomTag("");
                      } else {
                        // Show an error message (you can use toast.error here)
                        toast.error("Can't add more than 5 tags.")
                      }
                    } else {
                      // Show an error message (you can use toast.error here)
                      toast.error("Can't add the same tag again.")
                    }
                    setSuggestedTags([]);
                    setCustomTag("");
                  }}
                  sx={{
                    width: "100%",
                    padding: "5px 8px",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "rgba(0,0,0,0.3)" },
                    borderRadius: "5px",
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          )}

            {tags?.length > 0 && (
              <div style={{ margin: "5px 0 10px" }}>
                {tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`${tag}`}
                    onDelete={() => handleTagRemove(tag)}
                    sx={{ marginRight: "10px", marginBottom: "5px" }}
                  />
                ))}
              </div>
            )}

            <div className="final-touch-btns" style={{display:"flex", justifyContent:"flex-end", margin:"20px 0 10px"}}>
              <Button sx={{marginRight:"20px"}} onClick={handleTagsModalClose} variant="outlined">Back</Button>
              <Button  variant="contained" onClick={handleSubmit}>Publish</Button>
            </div>
          </Box>
      </Modal>

    </div></>
  );
}

export default Editor2;