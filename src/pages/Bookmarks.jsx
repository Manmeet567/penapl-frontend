import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useAuthContext } from '../hooks/useAuthContext'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Blog from '../components/Blog/Blog';

function Bookmarks() {

  const {userData} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);

  // useEffect(() => {
  //   console.log(blogs)
  // }, [blogs])

  useEffect(() => {
    setLoading(true);
    if(userData){
      getBookmarks()
    }
    else{
      setLoading(false);
      toast.error("Please login first!");
    }

  }, [userData])


  const getBookmarks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/get-bookmarked-blogs`, {
        headers: {
          authorization: `Bearer ${userData?.token}`,
        },
      });

      if(response.status == 200) {
        setLoading(false);
        setBlogs(response.data.bookmarks);
      }

    } catch (error) {
      setLoading(false)
      console.log(error);
      toast.error("An error occured!");
    }
  }
  
  
  return (
    <div className="bookmarks">
      <Navbar />

      <div
        className="blogContent"
        style={{ maxWidth: "1000px", paddingTop: "100px", margin: "0px auto" }}
      >

        {loading ? <div><h2>Loading . . .</h2></div> : blogs && blogs?.length > 0 ? blogs?.map((blog) => (<Blog data={blog} key={blog?._id} />)) : <div><h2>No bookmarked blogs.</h2></div>}
        
      </div>

    </div>
  )
}

export default Bookmarks
