import React, { useEffect } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useAuthContext } from '../hooks/useAuthContext';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useState } from 'react';
import { useBlogContext } from '../hooks/useBlogContext';
import { useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Box,Button} from '@mui/material'
import { TagsInput } from "react-tag-input-component";
import FileUpload from '../components/SmallComponents/FileUpload';



function UpdateBlog() {
    const { userData} = useAuthContext();
    // const [prevBlogData, setPrevBlogData] = useState("");
    // const [newBlogData, setNewBlogData] = useState('');
    const {blogs, dispatch} = useBlogContext();
    const [updating, setUpdating] = useState('Update')
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    
    const [prevBlogTitle, setPrevBlogTitle] = useState('');
    const [newBlogTitle, setNewBlogTitle] = useState('');

    const [prevBlogData, setPrevBlogData] = useState('');
    const [newBlogData, setNewBlogData] = useState('');

    const [prevCoverImageUrl, setPrevCoverImageUrl] = useState('');
    const [newCoverImageUrl, setNewCoverImageUrl] = useState('');

    const [prevTags, setPrevTags] = useState([]);
    const [newTags, setNewTags] = useState([]) 



    useEffect(() => {
      setLoading(true)
      const prevData = blogs.find((blog) => blog._id === id);
      console.log(prevData)
      if(prevData){
        
        setPrevBlogTitle(prevData?.blogTitle);
        setNewBlogTitle(prevData?.blogTitle);

        setPrevBlogData(prevData?.blogData);
        setNewBlogData(prevData?.blogData);

        setPrevCoverImageUrl(prevData?.cover_image_url);
        setNewCoverImageUrl(prevData?.cover_image_url);

        setPrevTags(prevData?.tags);
        setNewTags(prevData?.tags);
        
        setLoading(false);
    }
    else{
        toast.error("Blog does not exist!")
        setLoading(false);
    }
    }, [])

    const handleUpdate = async () => {
        setUpdating('Updating')
        if(prevBlogTitle=== newBlogTitle && prevBlogData === newBlogData && prevTags === newTags && prevCoverImageUrl === newCoverImageUrl ) {
            setUpdating('Update')
            toast.error("No updates detected.")
        }
        else{
          if(newTags?.length > 5) {
            toast.error("Only 5 tags allowed");
            setUpdating('Update')
            return
          }
          if(newCoverImageUrl === null) {
            toast.error("Cover Image can't be empty!");
            setUpdating('Update');
            return
          }
            const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}api/updateBlog/${id}`, {newBlogTitle:newBlogTitle ,newBlogData:newBlogData, newTags:newTags, newCoverImageUrl: newCoverImageUrl} ,{
                headers:{
                    authorization: `Bearer ${userData?.token}`,
                    'Content-Type': 'application/json'
                }
            })

            if(response.status === 200) {
                
                toast.success("Blog updated successfully!")
                dispatch({type:'UPDATE_BLOGS', payload:response.data})
                setUpdating('Update')
                setPrevBlogData(newBlogData);
            }
            if(response.status !== 200) {
                toast.error(response.data.error)
                setUpdating('Update')
            }
        }
    }

  return (
    <div className="updateBlog">
        <Navbar />

        <div
        className="cb-content"
        style={{ maxWidth: "1300px", margin: "0 auto" }}
      >
       {loading ? <h2 style={{paddingTop:"120px"}}>Loading . . .</h2> : <><h2 className="cb-h2" style={{ paddingTop: "100px", textAlign:"center" }}>
          Update your Blog
        </h2>

        <h2 className="cb-h2">
          Title:
        </h2>
        <input type="text" placeholder="Enter Title" value={newBlogTitle} onChange={(e) => setNewBlogTitle(e.target.value)} style={{border:"1px solid #ddd",fontSize:"18px", padding:"10px", width:"100%", marginTop:"10px", borderRadius:"5px", outline:"none  "}}/>

        <FileUpload setImageData={setNewCoverImageUrl} imageData={newCoverImageUrl} />

        <CKEditor
          style={{ marginTop: "100px" }}
          editor={ClassicEditor}
          data={newBlogData}
        
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "|",
              "undo",
              "redo",
              "|",
              "numberedList",
              "bulletedList",
              "|",
              "mediaEmbed",
              "|",
              "blockQuote",
              "|",
              "insertTable"
            ],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();

            setNewBlogData(data)
          }}
        />

        <Box className="tags-input" sx={{margin:"20px 0 10px"}}>
          <TagsInput value={newTags} onChange={setNewTags} name="tags" placeHolder="Enter tags"/>
        </Box>

        <div style={{margin:"0 0 50px", display:"flex", alignItems:"center"}}>
          <Link to={`/blog/${id}`}><Button variant='outlined' style={{ marginTop: "10px",marginRight:'20px', padding: "7px 15px", cursor: "pointer" }}>Cancel</Button></Link>
          <Button variant='contained' onClick={handleUpdate}
            style={{ marginTop: "10px", padding: "7px 15px", cursor: "pointer" }} disabled={updating !== "Update"}
          >
            {updating}
          </Button>
        </div>
        </>
        
        }
      </div>
    </div>
  )
}

export default UpdateBlog