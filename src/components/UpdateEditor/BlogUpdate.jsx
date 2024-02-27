import { useState, useRef, useEffect } from "react";
import Navbar from '../Navbar/Navbar';
import './HTMLContent.css';
import Editor from "./Editor";
import { PiImageLight } from "react-icons/pi";
import {Button, Box, Chip, CircularProgress} from '@mui/material';
import { toast } from "react-toastify";
import { blog_tags } from "../../utils/blogTags";
import {MdOutlineClose} from 'react-icons/md';
import Modal from '@mui/material/Modal';
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import _ from 'lodash';
import { useBlogContext } from "../../hooks/useBlogContext";
import { IoMdClose } from "react-icons/io";
import PreviewBlog from "../PreviewBlog/PreviewBlog";
import { convertJsonToHtml } from "../../utils/jsonToHtml";


function BlogUpdate() {
  const navigate = useNavigate();
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

  const textareaRef = useRef(null);
  const { userData} = useAuthContext();
  const { dispatch } = useBlogContext();
  const { id } = useParams();
  const [jsonBlogData, setJsonBlogData] = useState(null);
  const [uploadFromDevice, setUploadFromDevice] = useState(false);
  const [open, setOpen] = useState(false);
  const [tagsModal,setTagsModal] = useState(false);
  const [error, setError] = useState(null);
  const [customTag, setCustomTag] = useState('');
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [preview, setPreview] = useState(false);

  useEffect(() => {toast.error(error)}, [error])

  const [loading, setLoading] = useState(false);
  const [prevBlogTitle, setPrevBlogTitle] = useState('');
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [prevBlogData, setPrevBlogData] = useState('');
  const [prevCoverImageUrl, setPrevCoverImageUrl] = useState('');
  const [newCoverImageUrl, setNewCoverImageUrl] = useState('');
  const [prevTags, setPrevTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTagsModalOpen = () => setTagsModal(true);
  const handleTagsModalClose = () => setTagsModal(false);

  
  const clearImage = () => {
    setNewCoverImageUrl(null);
  };


  const handleUpdate = async () => {
    if(_.isEqual(prevBlogData, JSON.stringify(jsonBlogData)) && prevBlogTitle === newBlogTitle && prevTags === newTags && prevCoverImageUrl === newCoverImageUrl) {
      toast.error("No updates detected.")
    }
    else{
      if(newTags?.length > 5) {
        toast.error("Only 5 tags allowed");
        return
      }
      if(newCoverImageUrl === null) {
        toast.error("Cover Image can't be empty!");
        return
      }
      const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}api/updateBlog/${id}`, {newBlogTitle:newBlogTitle ,newBlogData:JSON.stringify(jsonBlogData), newTags:newTags, newCoverImageUrl: newCoverImageUrl} ,{
        headers:{
            authorization: `Bearer ${userData?.token}`,
            'Content-Type': 'application/json'
        }
      })
      if(response.status === 200) {
                
        toast.success("Blog updated successfully!")
        dispatch({type:'UPDATE_BLOGS', payload:response.data})
        
        setPrevBlogData(JSON.stringify(jsonBlogData));
        setPrevBlogTitle(newBlogTitle);
        setPrevTags(newTags);
        setPrevCoverImageUrl(newCoverImageUrl); 
        navigate(`/blog/${response?.data?.slug}`)
      }
      if(response.status !== 200) {
          toast.error(response.data.error)
      }
    }
  }


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
        setNewCoverImageUrl(data.secure_url);
      } catch (error) {
        setError('Image upload failed. Please try again.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };


  const handleKeyPress = (e) => {
    if (e.key === "Enter" && customTag.trim() !== "") {
      if (!newTags.includes(customTag)) {
        if (newTags.length < 5) {
          setNewTags((prevTags) => [...prevTags, customTag]);
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
      if (!newTags.includes(customTag)) {
        if (newTags.length < 5) {
          setNewTags((preTags) => [...preTags, customTag]);
          setCustomTag("");
        } else {
          toast.error("Can't add more than 5 tags.")
        }
      } else{
        toast.error("Can't add the same tag again.")
      }
    }
  }


  useEffect(() => {
    const comparing = _.isEqual(prevBlogData, JSON.stringify(jsonBlogData));
    console.log(comparing)
  }, [prevBlogData,jsonBlogData])


  useEffect(() => {
    setLoading(true);
  
    axios.get(`${import.meta.env.VITE_BASE_URL}api/blogs/${id}`)
      .then((response) => {
        if (response.status === 200) {
          const prevData = response.data;
  
          setPrevBlogTitle(prevData?.blogTitle);
          setNewBlogTitle(prevData?.blogTitle);
  
          setPrevBlogData(prevData?.blogData);
          setJsonBlogData(JSON.parse(prevData?.blogData));
  
          setPrevCoverImageUrl(prevData?.cover_image_url);
          setNewCoverImageUrl(prevData?.cover_image_url);
  
          setPrevTags(prevData?.tags);
          setNewTags(prevData?.tags);
  
          setLoading(false);
        } else {
          toast.error("Blog does not exist!");
          setLoading(false);
        }
      })
      .catch((error) => {
        toast.error("An error occurred while fetching the blog data.");
        setLoading(false);
      });
  }, [id]);
  


  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
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
    const updatedTags = newTags.filter((tag) => tag !== tagToRemove);

    setNewTags(updatedTags);
  };

  const handleUpdateCheck = () => {
    const blogObj = {
      newTitle:newBlogTitle,
      newBlogData:JSON.stringify(jsonBlogData),
      newTags,
      newCoverImageUrl
    }
    console.log(blogObj);
  }


  return (
    <>
      <Navbar />
      <div className="editor" style={{width:"650px", margin:"0 auto", paddingTop:"110px"}}>

        {loading && <div><CircularProgress /></div>}
        {!loading && <><div
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
              Update
            </Button>}
          </div>
        </div>
        
        {preview && <PreviewBlog blogTitle={newBlogTitle} imageData={newCoverImageUrl} blogData={convertJsonToHtml(jsonBlogData)} tags={newTags} preview={preview} />}
        
        {!preview && <div style={{margin:"40px 0"}}>
            <div className="title-input">
              <textarea
                    ref={textareaRef}
                    type="text"
                    placeholder="Title..."
                    value={newBlogTitle}
                    onChange={(e) => setNewBlogTitle(e.target.value)}
                    style={headingStyles}
                    onInput={handleTextareaInput}
              />
            </div>

            {newCoverImageUrl && <div style={{ position: "relative" }}>
          <img
            src={newCoverImageUrl}
            alt="Image not found"
            style={{ width: "100%", maxHeight: "700px", margin: "20px 0" }}
          />
          <div>
            <IoMdClose
              onClick={() => setNewCoverImageUrl(null)}
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
        </div>}

        {jsonBlogData && <Editor style={{margin:"20px 0"}} data={jsonBlogData} onChange={setJsonBlogData} editorblock="editorjs-container-update" /> }

        </div>}
        </>
        }


        
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
            <input value={newCoverImageUrl} onChange={(e) => {setNewCoverImageUrl(e.target.value)}} type="url" style={{margin:"10px 0 0", padding:"5px", outline:"none"}} />
          </div>

          <p style={{textAlign:"center", margin:"20px 0"}}>OR</p>
          
          <div className="select-from-device">
            <Button variant="contained" sx={{width:"100%"}} onClick={() => setUploadFromDevice(true)}>Upload From Device</Button>
          </div></>}

          {uploadFromDevice && <div style={{margin:"20px 0 0"}}>
            {loading && <CircularProgress />}
            {!newCoverImageUrl && !loading && <input type="file" onChange={handleFileInput} accept="image/*" />}
            {newCoverImageUrl && <div style={{ minWidth:"300px", display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
            <div style={{padding:"10px", border:"1px solid #333"}}><img src={newCoverImageUrl} alt="Selected" style={{ height:"200px"}}/><MdOutlineClose onClick={clearImage} style={{position:"absolute", backgroundColor:"red", color:"#fff", borderRadius:"50%", padding:"5px", fontSize:"30px", cursor:"pointer", transform:"translate(-2px,-23px)"}}/></div>
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
                    if (!newTags.includes(tag)) {
                      if (newTags.length < 5) {
                        // Check if the tag is not already in tags and if there are less than 5 tags
                        setNewTags((prevTags) => [...prevTags, tag]);
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

            {newTags?.length > 0 && (
              <div style={{ margin: "5px 0 10px" }}>
                {newTags?.map((tag, index) => (
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
              <Button disabled={newTags?.length > 0 ? false : true} variant="contained" 
                onClick={handleUpdate}
              >Publish</Button>
            </div>
          </Box>
      </Modal>

      </div>
    </>
  )
}

export default BlogUpdate






