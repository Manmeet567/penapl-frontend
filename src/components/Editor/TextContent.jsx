import { useRef, useState } from 'react';
import OptionsIcon from './OptionsIcon';

function TextContent({ text, onTextChange, onEnterPress, onDelete }) {
  const [iconClicked, setIconClicked] = useState(false);
  const textareaRef = useRef();
  const [currentText, setCurrentText] = useState(text);

  const contentStyle = {
    fontSize: "22px",
    lineHeight: "1.5",
    color: "#000",
    border: "none",
    outline: "none",
    width: "100%",
    wordWrap: "break-word",
    overflow: "hidden",
    margin: "20px 0",
    resize: "none",
    display: iconClicked ? "none" : "inline",
    transition: ".2s linear",
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 20 + "px";
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrentText(newText);
    onTextChange(newText);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onEnterPress();
    } else if (e.key === "Backspace" && currentText === "") {
      e.preventDefault();
      onDelete();
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <div style={{ display: "flex" }}>
      <OptionsIcon iconClicked={iconClicked} setIconClicked={setIconClicked} onDelete={handleDelete} />
      <textarea
        ref={textareaRef}
        type="text"
        value={currentText}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        placeholder="Tell your story..."
        style={contentStyle}
        onInput={handleTextareaInput}
      />
    </div>
  );
}

export default TextContent;
