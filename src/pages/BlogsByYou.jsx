import React, { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Blog from "../components/Blog/Blog";
import { useBlogContext } from "../hooks/useBlogContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function BlogsByYou() {
  const { userData } = useAuthContext();
  const { blogs } = useBlogContext();

  const currentUserData = blogs?.filter(
    (blog) => blog.author === userData.user.username
  );


  return (
    <div className="blogsByYou">
      <Navbar />

      <div
        className="blogContent"
        style={{ maxWidth: "1000px", paddingTop: "100px", margin: "0px auto" }}
      >
          

          {!blogs ? <div style={{fontSize:"28px"}}>Loading. . .</div>  : currentUserData?.length === 0 ? <div><h2>No blogs by you.</h2><Link to='/createBlog'><Button variant="contained" sx={{margin:"20px 0"}}>Write One</Button></Link></div> : currentUserData.map((blog) => (
            <Blog data={blog} key={blog._id} />
          ))}
        
        
      </div>
    </div>
  );
}

export default BlogsByYou;
