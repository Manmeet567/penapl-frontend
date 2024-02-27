import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import Blog from "../components/Blog/Blog";
import { useBlogs } from "../hooks/useBlogs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "@mui/material";
import { useBlogContext } from "../hooks/useBlogContext";
import axios from 'axios';
import NewBlog from "../components/Blog/NewBlog";

function Blogs() {
  const [start, setStart] = useState(0);
  const [nth, setNth] = useState(2);
  const { getBlogs, loading, error, total } = useBlogs(start);
  const {blogs,dispatch} = useBlogContext();
  const [data, setData] = useState([]);
  const [end, setEnd] = useState(false);

  if(error){
    toast.error(error)
  }


  useEffect(() => { 
    setData(blogs);
    // setChecked(true);
  }, [blogs])

  useEffect(() => {
    getBlogs();
    setStart((nth-1) * 6)
    setNth(nth+1);
  }, []);

  const getMoreBlogs = async () => {
    try {
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/blogs`, {start})
      if(response.status == 200){
        // console.log(response.data);
        dispatch({type:"ADD_BLOGS", payload:response.data.blogs})
        if(response.data.next === 0) {
          setEnd(true);
        }
      }

    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className="blogs">
      <Navbar />

      <div
        className="blogContent"
        style={{ maxWidth: "850px", paddingTop: "100px", margin: "0px auto",display:"flex", flexDirection:"column" }}
      >
        {loading && <div className="loading"><p style={{fontSize:'30px'}}>Loading . . . </p></div>} 
        {data?.length === 0 && <div><h2>No Blogs yet.</h2></div> }
        {data?.map((blog) => (
          <div key={blog._id} className="all-blogs-main-page">
            <NewBlog data={blog} />
          </div>
          
        ))}

        {!end && !loading && total > 6 && <div className="show-more" style={{marginLeft:"20px", marginBottom:"50px",marginRight:"30px", width:"100%"}}>
          <Button onClick={getMoreBlogs} sx={{width:"100%", borderRadius:"60px", color:"#000", backgroundColor:"rgba(0,0,0,0.2)", ":hover":{backgroundColor:"rgba(0,0,0,0.4)", color:"#fff"}, transition:".1s linear"}} disabled={loading ? true : false}>{loading ? 'Loading . . .' : 'Load More'}</Button>
        </div>}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Blogs;
