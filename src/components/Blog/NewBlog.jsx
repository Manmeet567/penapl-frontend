import { Link } from 'react-router-dom';
import './Blog.css'
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { Chip, Grow } from '@mui/material';
import {FaRegBookmark, FaBookmark} from 'react-icons/fa6';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { toast } from "react-toastify";
import axios from 'axios';
import { convertJsonToHtml } from '../../utils/jsonToHtml';

function NewBlog({data}) {

    const heading = data?.blogTitle;
  const wordCount = data?.blogData.split(' ').length;
  const averageWordsPerMinute = 200;
  const readTimeMinutes = Math.ceil(wordCount / averageWordsPerMinute);
  const [bookmark, setBookmark] = useState(false);
  const {userData, dispatch} = useAuthContext();
  const [checked, setChecked] = useState(true);
  const [blogContent, setBlogContent] = useState("");
  useEffect(() => {
    const htmlContent = convertJsonToHtml(JSON.parse(data?.blogData));
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const paragraphElements = doc.querySelectorAll('p');

    const allContent = Array.from(paragraphElements).map((paragraph) => paragraph.textContent.trim()).join(' ');
    setBlogContent(allContent);
  }, [data])

  useEffect(() => {
    console.log(blogContent)
  }, [blogContent])


  useEffect(() => {
    const blog_id = data?._id;
    if (userData && userData.user.bookmarks) {
      const isBookmarked = userData.user.bookmarks.includes(blog_id);
      setBookmark(isBookmarked);
    } else {
      setBookmark(false);
    }
  }, [userData, data]);


  const handleAddBookmark = async (blog_id) => {
    if(userData){
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/add-bookmark`, {blog_id}, {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        })

        if(response.status === 200) {
          dispatch({type:"ADD_BOOKMARK", payload:blog_id})
          setBookmark(true);
          toast.success("Added to bookmarks");

          const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));

          // Check if userData exists in localStorage
          if (userDataFromLocalStorage) {
            // Modify the bookmarks array in userData
            userDataFromLocalStorage.user.bookmarks.push(blog_id);

            // Save the updated userData back to localStorage
            localStorage.setItem('userData', JSON.stringify(userDataFromLocalStorage));
          }

        }
        else{
          toast.error("Operation Failed!");
        }
      } catch (error) {
        console.log(error);
        toast.error("Internal server error!")
      }
    }
    else{
      toast.error("Signup or Login to bookmark!");
    }
  }

  const handleRemoveBookmark = async (blog_id) => {
    if (userData) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/remove-bookmark`, { blog_id }, {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        });
  
        if (response.status === 200) {
          // Remove blog_id from bookmarks
          const updatedBookmarks = userData.user.bookmarks.filter((item) => item !== blog_id);
  
          dispatch({ type: "REMOVE_BOOKMARK", payload: blog_id });
          setBookmark(false);
          toast.success("Bookmark removed");
  
          const userDataFromLocalStorage = JSON.parse(localStorage.getItem('userData'));
  
          if (userDataFromLocalStorage) {
            // Update bookmarks in local storage
            userDataFromLocalStorage.user.bookmarks = updatedBookmarks;
            localStorage.setItem('userData', JSON.stringify(userDataFromLocalStorage));
          }
        } else {
          toast.error("Failed");
        }
      } catch (error) {
        console.log(error);
        toast.error("Internal server error!");
      }
    } else {
      toast.error("Signup or Login to bookmark!");
    }
  };
  

  return (
    <Grow in={checked}>
      <div className="single-blog" >
        <div className="blog-link-content">
        <Link to={`/blog/${data?.slug}`} style={{textDecoration:"none", color:"#000"}}>
          <div className="author-info" style={{fontSize:"14px", margin:"0px 0 10px"}}>
              <span>{data.author} • </span>
              <span style={{color:"#6B6B6B"}}>{formatDistanceToNow(new Date(data?.createdAt),{addSuffix: true})}</span>
            </div>
        </Link>

        <Link to={`/blog/${data?.slug}`} style={{textDecoration:"none", color:"#000"}}>
          <div className="img-and-content" style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <div className="blog-info-content" style={{width:"70%"}}>
              <h2 style={{fontSize:"20px", fontWeight:"700", marginBottom:"10px"}}>{heading}</h2>
              <p style={{fontSize:"16px", lineHeight:"24px", fontWeight:"350"}}>{blogContent.slice(0, 200)}...</p>
            </div>
            <div className="img-content" style={{width:"25%"}}>
            <img src={data?.cover_image_url} alt="Image not found" style={{ height:"120px",width:"100%", margin:"10px auto 0", borderRadius:"5px"}}/>
            </div>
          </div>
        </Link>
        </div>

        <div className="closing-content" style={{ marginTop:"20px", display:"flex", justifyContent:"space-between",}}>
          <div className="tag-and-read-time" style={{display:"flex", alignItems:"center"}}>
            <Link to={`/search-blog/${data?.tags[0]}`}><Chip sx={{marginRight:"7px", transition:".1s linear", padding:"0 5px"}} size='small' variant='contained' label={data?.tags[0]} /></Link>
            <span style={{fontSize:"13px", color:"#6B6B6B"}}>{readTimeMinutes} min read</span>
          </div>

          <div className="bookmark-icon">
          <div style={{marginTop:"14px",cursor:"pointer"}} >
            {bookmark ? <FaBookmark onClick={() => handleRemoveBookmark(data?._id)} style={{fontSize:"20px"}} /> : <FaRegBookmark onClick={() => handleAddBookmark(data?._id)} style={{fontSize:"20px"}} />}
          </div>
          </div>

        </div>

        <div style={{margin:"30px 0", backgroundColor:"rgb(207 207 207)", height:"1px", width:"100%", }} ></div>
      </div>
     </Grow>
  )
}

export default NewBlog