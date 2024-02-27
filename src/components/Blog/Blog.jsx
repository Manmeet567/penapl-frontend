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



function Blog({data}) {

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
      <div className="blog" style={{maxWidth:'450px', margin:'20px 20px', minWidth:'450px', boxShadow:"rgba(0, 0, 0, 0.2) 1px 1px 30px", color:'black' , padding:"20px", borderRadius:"10px", userSelect:"none"}}>
        
        <Link to={`/blog/${data?.slug}`} style={{textDecoration:"none", color:"#000"}}>
          <h2 style={{textAlign:"center"}}>{heading}</h2>

          <img src={data?.cover_image_url} alt="Image not found" style={{ height:"200px",width:"100%", margin:"10px auto 0", borderRadius:"5px"}}/>

            <div className="timeandauthor" style={{display:'flex', justifyContent:'space-between', marginTop:'20px'}}>
              <p style={{ fontSize:'14px'}}><strong>Uploaded {formatDistanceToNow(new Date(data?.createdAt),{addSuffix: true})}</strong></p>
              <p style={{ fontSize:'14px'}}><strong>Written by - {data.author}</strong></p>
              
            </div>
            <div className="likesandreadtime" style={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
              <p style={{ fontSize:'14px'}}>Likes : {data.blogLikes.length}</p>
              <p style={{ fontSize:'14px', color:"rgba(0,0,0,0.5)"}}>{readTimeMinutes} minute read</p>
            </div>
        </Link>
        <div className="tagsnbookmark" style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
          <div className="tags" style={{display:'flex', marginTop:"10px"}}>
            {data?.tags.slice(0, 3).map((tag) => (
              <Link to={`/search-blog/${tag}`}><Chip sx={{marginRight:"15px", transition:".1s linear"}} variant='outlined' label={tag} /></Link>
            ))}
          </div>

          <div style={{marginTop:"14px",cursor:"pointer"}} >
            {bookmark ? <FaBookmark onClick={() => handleRemoveBookmark(data?._id)} style={{fontSize:"20px"}} /> : <FaRegBookmark onClick={() => handleAddBookmark(data?._id)} style={{fontSize:"20px"}} />}
          </div>
        </div>
     </div>
     </Grow>
  )
}

export default Blog

{/* <h2 dangerouslySetInnerHTML={{ __html: heading }}></h2> */}

{/* <div className="blog" style={{maxWidth:'450px', margin:'20px 20px', minWidth:'450px', boxShadow:"rgba(0, 0, 0, 0.2) 1px 1px 30px", color:'black' , padding:"20px", borderRadius:"10px", userSelect:"none"}}>
        
        <Link to={`/blog/${data?.slug}`} style={{textDecoration:"none", color:"#000"}}>
          <h2 style={{textAlign:"center"}}>{heading}</h2>

          <img src={data?.cover_image_url} alt="Image not found" style={{ height:"200px",width:"100%", margin:"10px auto 0", borderRadius:"5px"}}/>

            <div className="timeandauthor" style={{display:'flex', justifyContent:'space-between', marginTop:'20px'}}>
              <p style={{ fontSize:'14px'}}><strong>Uploaded {formatDistanceToNow(new Date(data?.createdAt),{addSuffix: true})}</strong></p>
              <p style={{ fontSize:'14px'}}><strong>Written by - {data.author}</strong></p>
              
            </div>
            <div className="likesandreadtime" style={{display:'flex', justifyContent:'space-between', marginTop:'10px'}}>
              <p style={{ fontSize:'14px'}}>Likes : {data.blogLikes.length}</p>
              <p style={{ fontSize:'14px', color:"rgba(0,0,0,0.5)"}}>{readTimeMinutes} minute read</p>
            </div>
        </Link>
        <div className="tagsnbookmark" style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap"}}>
          <div className="tags" style={{display:'flex', marginTop:"10px"}}>
            {data?.tags.slice(0, 3).map((tag) => (
              <Link to={`/search-blog/${tag}`}><Chip sx={{marginRight:"15px", transition:".1s linear"}} variant='outlined' label={tag} /></Link>
            ))}
          </div>

          <div style={{marginTop:"14px",cursor:"pointer"}} >
            {bookmark ? <FaBookmark onClick={() => handleRemoveBookmark(data?._id)} style={{fontSize:"20px"}} /> : <FaRegBookmark onClick={() => handleAddBookmark(data?._id)} style={{fontSize:"20px"}} />}
          </div>
        </div>
    </div> */}