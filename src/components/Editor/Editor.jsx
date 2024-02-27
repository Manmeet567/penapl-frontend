import React, { useRef, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { PiImageLight } from "react-icons/pi";
import { LiaGripLinesSolid } from "react-icons/lia";

import { Button, Box } from "@mui/material";
import "./Editor.css";
import TextContent from "./TextContent";

function TextEditor() {
  const [iconClicked, setIconClicked] = useState(false);
  const [editorContents, setEditorContents] = useState([{ text: "" }]);

  const headingStyles = {
    fontSize: "2.25rem",
    fontWeight: "700",
    lineHeight: "1.4",
    color: "#000",
    border: "none",
    outline: "none",
    width: "100%",
    wordWrap: "break-word",
    overflow: "hidden",
    resize: "none",
    marginLeft: "50px",
  };

  const textareaRef = useRef(null);

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  };

  const handleContentChange = (index, newContent) => {
    const updatedContents = [...editorContents];
    updatedContents[index].text = newContent;
    setEditorContents(updatedContents);
  };

  const handleEnterPress = (index) => {
    const newContents = [...editorContents];
    newContents.splice(index + 1, 0, { text: "" });
    setEditorContents(newContents);
  };

  const handleDeleteContent = (index) => {
    if (editorContents.length > 1) {
      const newContents = [...editorContents];
      newContents.splice(index, 1);
      setEditorContents(newContents);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="editor"
        style={{ paddingTop: "120px", width: "800px", margin: "0 auto" }}
      >
        <div
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
            <Box
              className="add-cover-image"
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                cursor: "pointer",
                padding: "3px 10px",
              }}
            >
              <PiImageLight style={{ marginRight: "5px", fontSize: "20px" }} />
              <span>Add cover image</span>
            </Box>

            <Box
              className="add-subtitle"
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
                marginLeft: "30px",
                cursor: "pointer",
                padding: "3px 10px",
              }}
            >
              <LiaGripLinesSolid
                style={{ marginRight: "5px", fontSize: "20px" }}
              />
              <span>Add subtitle</span>
            </Box>
          </div>

          <div className="heo-preview-options">
            <Button variant="outlined" sx={{ borderRadius: "50px" }}>
              Preview
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: "50px", marginLeft: "10px" }}
            >
              Publish
            </Button>
          </div>
        </div>

        <div className="main-content-editor" style={{ margin: "30px 0" }}>
          <div className="mce-title">
            <textarea
              ref={textareaRef}
              type="text"
              placeholder="Article Title..."
              style={headingStyles}
              onInput={handleTextareaInput}
            />
          </div>

          <div className="mce-blog-content">
            <div className="mce-body">
              {editorContents.map((content, index) => (
                <TextContent
                  key={index}
                  text={content.text}
                  onTextChange={(newContent) => handleContentChange(index, newContent)}
                  onEnterPress={() => handleEnterPress(index)}
                  onDelete={() => handleDeleteContent(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TextEditor;
