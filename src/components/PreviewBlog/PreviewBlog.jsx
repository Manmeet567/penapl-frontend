import { Link } from "react-router-dom";
import { Chip } from "@mui/material";
import { useAuthContext } from "../../hooks/useAuthContext"
import {PiHeartBold} from 'react-icons/pi';
import {FacebookShareButton, FacebookIcon ,TwitterShareButton,  RedditShareButton, RedditIcon, LinkedinShareButton, LinkedinIcon} from 'react-share';
import {FaXTwitter} from 'react-icons/fa6';
import {IoLinkSharp} from 'react-icons/io5';
import NewComments from "../Comments/NewComments";

function PreviewBlog({blogTitle, imageData, blogData, tags, preview}) {

  const {userData} = useAuthContext();

  return (
    <div className="preview-blog">
      <div style={{display:"flex", marginTop:"20px"}}>
          <div className="read-time-option">
            <p style={{backgroundColor:"#1689ffbf", padding:"5px 15px", borderRadius:"50px", color:"#fff", cursor:"pointer", textAlign:"center"}} >Calculate Read Time</p>
          </div>
          <div className="show-audio-option" style={{marginLeft:"20px"}}>
          <p style={{backgroundColor:"#1689ffbf", padding:"5px 15px", borderRadius:"50px", color:"#fff", cursor:"pointer", textAlign:"center"}} >Listen to this Blog</p>
          </div>
        </div>
        <hr style={{margin:"30px 0"}}/>
          <h1 style={{margin:"30px 0 40px", textAlign:"center"}}>{blogTitle}</h1>

          {imageData && <img src={imageData} alt="Image not found" style={{width:"100%", maxHeight:"700px", marginBottom:"20px"}}/>}

          <div dangerouslySetInnerHTML={{ __html: blogData }} />

          <div className="blog-author">
            <h3 style={{ margin: "30px 0 20px" }}>Written by - {userData.user.username}</h3>
          </div>
          
          <div className="tags" style={{display:'flex'}}>
          {tags && tags.length > 0 && <h3>Tags: </h3>}
          {tags && tags.map((tag,index) => (
            <Link key={index}><Chip label={tag} variant="outlined" sx={{margin:"0 5px 20px", transition:".1s linear"}}/></Link>
          ))}
        </div>

        <div className="likeBtn" style={{display:"flex", alignItems:"center"}}>
          <div style={{display:"flex", alignItems:"center"}}>
            <PiHeartBold style={{fontSize:"30px", color:"red", cursor:"pointer" }} /> 
            <span style={{fontSize:"20px", marginLeft:"10px"}}>5</span>
          </div>
        </div>
        
        <div className="share-icons" style={{display:"flex", alignItems:"center", margin:"20px 0"}}>
          <p>Share this Blog : </p>
          <FacebookShareButton>
            <FacebookIcon style={{margin:"5px 8px 0"}} size={42} round/>
          </FacebookShareButton>

          <TwitterShareButton>
            <FaXTwitter style={{color:"#fff",margin:"5px 8px 0", backgroundColor:"#000", padding:"10px", fontSize:"40px", borderRadius:"50%"}}/>
          </TwitterShareButton>

          <RedditShareButton>
            <RedditIcon style={{margin:"5px 8px 0"}} size={42} round />
          </RedditShareButton>

          <LinkedinShareButton>
            <LinkedinIcon style={{margin:"5px 8px 0"}} size={42} round />
          </LinkedinShareButton>

          <div className="copy-blog-link">
            <IoLinkSharp style={{margin:"5px 8px 0", borderRadius:"50%", border:"2px solid #000", padding:"5px", fontSize:"40px", cursor:"pointer"}} />
          </div>

        </div>
        
        <NewComments preview={preview} />

      </div>
  )
}

export default PreviewBlog