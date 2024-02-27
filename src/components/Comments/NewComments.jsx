import React, {useEffect, useState} from 'react'
import { CircularProgress, Button} from '@mui/material';
import axios from 'axios';
import "./Comments.css";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useAuthContext } from '../../hooks/useAuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import NewReplySection from '../ReplySection/NewReplySection';


function NewComments({blog_id, user_id, username, preview}) {

  const [text, setText] = useState('');
  const {userData} = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [repliesCount, setRepliesCount] = useState([]);


  // Initialize repliesCount array with replyCount values from allComments
  useEffect(() => {
    setRepliesCount(allComments.map((comment) => comment.replyCount));
  }, [allComments]);

  // useEffect(() => console.log("Replies Count - ",repliesCount), [repliesCount])


  useEffect(() => {
    getAllComments(blog_id, user_id)
  }, [blog_id, user_id])

  const getAllComments = async (blog_id, user_id) => {
    if(preview){
      setAllComments([]);
      return
    }
    try {
      setLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/comment/getComments`, {blog_id, user_id});

      if(response.status === 200){
        setLoading(false);
        setAllComments(response.data);
      }
      else{
        setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      // console.log(error);
    }
  }


  const handleAddComment = async () => {
    if(preview){
      toast.success("This is a preview. You can't add a comment here!");
      return
    }
    const requestData = {
      forBlog:blog_id,
      commentText:text,
      userId:user_id,
      username
    }
    if(requestData.commentText === ''){
      toast.error("Comment can't be empty!");
      return
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/comment/addComment`, requestData , {
        headers: {
          authorization: `Bearer ${userData?.token}`,
        },
      })

      if(response.status === 200){
        const obj = { ...response.data, createdAt:Date.now(), replies:[], replyCount:0}

        setAllComments([obj, ...allComments]);
        setText('');
        setRepliesCount([0, ...repliesCount]);
        toast.success("Comment added successfully!");
      }
      else{
        toast.error(response.data.error);
      }
    } catch (error) {
      console.log(error)
      toast.error("Internal server error");
    }
  }

  const handleRemoveComment = async (comment_id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}api/comment/deleteComment`, {
        data: { comment_id }, // Pass comment_id in the request body
        headers: {
          authorization: `Bearer ${userData?.token}`,
        },
      });
  
      if (response.status === 200) {
        const deletedCommentId = response.data.deletedComment._id;
  
        // Filter out the deleted comment from the allComments array
        setAllComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== deletedCommentId)
        );
        setRepliesCount((prevCounts) => prevCounts.filter((_, index) => index !== 0));
  
        toast.success("Comment Deleted!");
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      // console.log(error)
      toast.error("Internal Server Error");
    }
  };


  return (
    <div
      className="commentSection"
      style={{
        maxWidth: "650px",
        margin: "0px auto",
      }}
    >

      <hr style={{ marginBottom: "20px" }} />
      <h2 style={{ textAlign: "center" }}>Comment Section</h2>

      <div className="cs-container" style={{maxHeight:"60vh", width: "100%" }}> 

      <div
          className="cs-comments"
          style={{
            padding: "10px 40px",
            width: "100%",
            maxHeight:"60vh",
            overflow: "auto",
            boxShadow: "inset rgba(0, 0, 0, 0.3) 0px 0px 20px 6px",
            marginTop: "20px",
            borderRadius: "10px",
          }}
        >

          {loading ? (
            <div><CircularProgress /></div>
          ) : allComments?.length === 0 ? (
            <div style={{ margin: "20px" }}>
              No Comments yet. But you can always add one.
            </div>
          ) : (
            allComments?.map((comment, index) => (
              <div
                key={index}
                className="cs-comment"
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.3) 0px 1px 15px",
                  padding: "10px 20px",
                  borderRadius: "10px",
                  margin: "30px 0",
                }}
              >
                <p
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  @<strong>{comment.from.username}</strong>
                  <span
                    style={{ marginLeft: "15px", color: "rgba(0,0,0,0.5)" }}
                  >
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </p>
                <div
                  style={{ fontSize: "22px", margin:"10px 0 30px" }}
                  dangerouslySetInnerHTML={{ __html: comment.commentText }}
                />           

                <NewReplySection handleRemoveComment={handleRemoveComment} comment_id={comment._id} replyCount={comment.replyCount}  index={index} setAllComments={setAllComments} replyData={comment.replies} from={comment?.from.user_id}/>
                {/* replyCount={comment?.replies.length} */}
              </div>
            ))
          )}
        </div>

        <div
          className="cs-addcomment"
          style={{ width: "100%", marginTop: "30px" }}
        >
          <h3>Add a Comment -</h3>
          <CKEditor
            style={{ marginTop: "20px" }}
            editor={ClassicEditor}
            data={text}
            config={{
              toolbar: ["heading", "|", "bold", "italic", "|", "undo", "redo"],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();

              setText(data);
            }}
          />
          <div className="cs-btn">
            <Button
              variant='contained'
              onClick={userData ? handleAddComment : (e) => {e.preventDefault(); toast.error("Log in to add a Comment!")}}
              style={{
                fontSize: "14px",
                marginTop: "20px",
                padding: "6px 10px",
                cursor: "pointer",
                marginBottom: "50px",
              }}
            >
              {loading ? <CircularProgress /> : 'Add Comment'}
            </Button>
          </div>

        </div>

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
  )
}

export default NewComments