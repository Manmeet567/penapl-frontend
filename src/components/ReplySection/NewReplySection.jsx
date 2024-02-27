import React, { useEffect } from 'react'
import { LuReply } from "react-icons/lu";
import { FaTrashAlt } from "react-icons/fa";
import { VscTriangleDown } from "react-icons/vsc";
import { useState } from "react";
import { CircularProgress, Button } from '@mui/material';
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";


function NewReplySection({replyCount, replyData, index, setAllComments, comment_id, handleRemoveComment, from}) {
  
  const { userData } = useAuthContext();
  const [replyText, setReplyText] = useState("");
  const [replyToggle, setReplyToggle] = useState(false);
  const [showReplyToggle, setShowReplyToggle] = useState(false);
  const [loading, setLoading] = useState(false);  
  

  const handleAddReply = async (e) => {
    e.preventDefault();
    const requestData = {
      comment_id,
      username: userData?.user.username,
      user_id: userData?.user._id,
      replyText,
    };
  
    if (!replyText) {
      toast.error("Reply text can't be empty!");
      return;
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}api/replies/addReply`,
          requestData,
          {
            headers: {
              authorization: `Bearer ${userData?.token}`,
            },
          }
        );
  
        if (response.status === 200) {
          const newReply = response.data;
          setReplyText('');
  
          setAllComments((prevComments) =>
            prevComments.map((comment, idx) => {
              if (idx === index) {
                // If this is the target comment, update its replies and replyCount
                return {
                  ...comment,
                  replies: [newReply, ...comment.replies], // Add the new reply at the beginning
                  replyCount: comment.replyCount + 1, // Increment replyCount
                };
              }
              return comment; // Return other comments as they are
            })
          );
  
          toast.success("Reply added!");
        } else {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.log(error);
        toast.error("Internal Server Error!");
      }
    }
  };


  // const handleRemoveReply = async (reply_id) => {
  //   try {
  //     const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}api/replies/deleteReply`, {
  //       data: { reply_id }, 
  //       headers: {
  //         authorization: `Bearer ${userData?.token}`,
  //       },
  //     })

  //     if (response.status === 200) {
  //       const deletedReplyId = response.data.deletedReply._id;
        
  //       setAllComments((prevComments) =>
  //         prevComments.map((comment, idx) => {
  //           if(idx === index) {

  //           }
  //         })
  //       );
        
  
  //       toast.success("Reply Deleted!");
  //     }

  //   } catch (error) {
  //     toast.error("Internal Server Error");
  //   }
  // }
  
  const handleRemoveReply = async (reply_id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}api/replies/deleteReply`,
        {
          data: { reply_id },
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        }
      );
  
      if (response.status === 200) {
        const deletedReplyId = response.data.deletedReply._id;
  
        setAllComments((prevComments) =>
          prevComments.map((comment, idx) => {
            if (idx === index) {
              // If this is the target comment, update its replies and replyCount
              return {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== deletedReplyId
                ), // Filter out the deleted reply
                replyCount: comment.replyCount - 1, // Decrement replyCount
              };
            }
            return comment; // Return other comments as they are
          })
        );
  
        toast.success("Reply Deleted!");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  };
  
  


  return (
    <div className="replySection" style={{ marginTop: "20px" }}>
      {/* <hr style={{margin:"10px 0"}}/> */}
      <div
        className="rs-btns"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="rs-c-btns"
          style={{ display: "flex", alignItems: "center" }}
        >

          <div
            className="reply"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={userData ? () => setReplyToggle((prev) => !prev) : (e) => {e.preventDefault(); toast.error("Log in to add a reply!");}}
          >
            <LuReply style={{ marginRight: "5px" }} />
            Reply
          </div>

          {userData && userData?.user._id === from && <div
            className="rs-bar"
            style={{
              width: "1px",
              height: "20px",
              backgroundColor: "#000",
              margin: "0 20px",
            }}
          ></div> 
          }

          {userData && userData?.user._id === from && <div
            className="delete"
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => handleRemoveComment(comment_id)}
          >
            <FaTrashAlt style={{ marginRight: "5px" }} />
            Delete
          </div>}

        </div>
        <div className="rs-sr-btn">
          <div
            className="sr-btn"
            style={{ alignItems: "center", display: "flex", cursor: replyCount !== 0 ? 'pointer' : 'auto' }}
            onClick={replyCount !== 0 ? () => setShowReplyToggle((prev) => !prev) : null}
          >
            {replyCount} {replyCount === 1 ? "Reply" : "Replies"}
            <VscTriangleDown style={{ marginLeft: "5px" }} />
          </div>
        </div>
      </div>

      <div
        className="reply-inbox"
        style={{ marginTop: "15px", display: replyToggle ? "block" : "none" }}
      >
        <form>
          <input
            type="text"
            placeholder="Reply"
            style={{ width: "100%", padding: "5px 10px", fontSize: "16px" }}
            value={replyText}
            onChange={(e) => {
              setReplyText(e.target.value);
            }}
          />
            <Button
            variant='contained'
            style={{
              padding: "4px 15px",
              margin: "14px 0 8px",
              cursor: "pointer",
            }}
            onClick={userData ? handleAddReply : (e) => {e.preventDefault(); toast.error("Log in to add a reply!");}}
          >
            Add Reply
          </Button>
          
          </form>
      </div>

      <div
        className="show-replies"
        style={{
          marginTop: "15px",
          display: showReplyToggle ? "block" : "none",
        }}
      >
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
              <CircularProgress />
            </div>
          ) : replyData.length > 0 && replyData.map((reply, index) => (
            <div
              className="reply-box"
              style={{
                margin: "20px 0",
                borderTop: "1px solid #333",
                paddingTop: "20px",
              }}
              key={index}
            >
              <div
                className="reply-by"
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                <p style={{ marginRight: "15px" }}>Reply By @{reply.from.username}</p>
                <p style={{ opacity: "0.5" }}>
                  {formatDistanceToNow(new Date(reply.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="reply-content" style={{ margin: "15px 0" }}>
                <p style={{ fontSize: "22px" }}>{reply.replyText}</p>
              </div>
              {userData && userData?.user._id === from && <div
                className="delete"
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => handleRemoveReply(reply._id)}
              >
                <FaTrashAlt style={{ marginRight: "5px" }} />
                Delete
              </div>}
            </div>
          ))}

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

export default NewReplySection
