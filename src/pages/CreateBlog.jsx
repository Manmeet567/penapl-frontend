import Navbar from "../components/Navbar/Navbar";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, Button, Chip } from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { blog_tags } from "../utils/blogTags";
import { useNavigate } from "react-router-dom";
import FileUpload from '../components/SmallComponents/FileUpload';



function CreateBlog() {
  const { userData } = useAuthContext();
  const navigate = useNavigate();
  const [blogTitle, setBlogTitle] = useState("");
  const [blogData, setBlogData] = useState("");
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState("");
  const [suggestedTags, setSuggestedTags] = useState([]);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    console.log(blogData);
  }, [blogData])

  const handleSubmit = async () => {
    if (blogTitle && blogData && tags?.length > 0 && imageData) {
      const blog = {
        blogTitle: blogTitle,
        blogData: blogData,
        author: userData.user.username,
        tags: tags,
        cover_image_url: imageData
      };
      if (tags?.length > 5) {
        toast.error("Only 5 tags allowed");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}api/createBlog`,
        blog,
        {
          headers: {
            authorization: `Bearer ${userData?.token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        setBlogData("");
        setBlogTitle("");
        setTags([]);
        setImageData(null);
        navigate(`/blog/${response.data._id}`);
        toast.success("Blog Created Successfully");
      }
      if (response.status !== 200) {
        toast.error(response.data.error);
      }
    } else {
      toast.error("All fields are required!");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && customTag.trim() !== "") {
      setTags((prevTags) => [...prevTags, customTag]);

      setCustomTag("");
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);

    setTags(updatedTags);
  };

  const filterSuggestedTags = (input) => {
    const filteredTags = blog_tags.filter((tag) =>
      tag.toLowerCase().includes(input.toLowerCase())
    );

    return filteredTags;
  };

  const handleCustomTagChange = (e) => {
    const input = e.target.value;
    setCustomTag(input);
    const newSuggestedTags = filterSuggestedTags(input);

    if (input && customTag) {
      setSuggestedTags(newSuggestedTags);
    } else {
      setSuggestedTags([]);
    }
  };

  return (
    <div className="createBlog">
      <Navbar />

      <div
        className="cb-content"
        style={{ maxWidth: "1300px", margin: "0 auto", paddingTop: "120px" }}
      >
        <div
          className="sb-btn"
          style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: "#1a1aef9c",
              ":hover": { backgroundColor: "#00c1189c" },
            }}
          >
            Add Blog
          </Button>
        </div>

        <h2 className="cb-h2">Title:</h2>
        <input
          type="text"
          placeholder="Enter Title"
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          style={{
            border: "1px solid #ddd",
            fontSize: "18px",
            padding: "10px",
            width: "100%",
            marginTop: "10px",
            borderRadius: "5px",
            outline: "none",
          }}
        />

        <h2 className="cb-h2" style={{ paddingTop: "20px" }}>
          Upload Cover Image:
        </h2>

        <FileUpload setImageData={setImageData} imageData={imageData} />

        <h2 className="cb-h2" style={{ paddingTop: "20px" }}>
          Write your Blog:
        </h2>
        <CKEditor
          style={{ marginTop: "100px" }}
          editor={ClassicEditor}
          data={blogData}
          config={{
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "|",
              "undo",
              "redo",
              "|",
              "numberedList",
              "bulletedList",
              "|",
              "mediaEmbed",
              "|",
              "blockQuote",
              "|",
              "insertTable"
            ],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();

            setBlogData(data);
          }}
        />

        <Box className="tags-input" sx={{ margin: "30px 0" }}>
          {/* <TagsInput value={tags} onChange={handleInputChange} name="tags" placeHolder="Enter tags"/> */}

          <Box
            sx={{
              padding: "5px 10px",
              border: "1.5px solid #b7b7b7",
              borderRadius: "5px",
            }}
          >
            {tags?.length > 0 && (
              <div style={{ margin: "5px 0 10px" }}>
                {tags?.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`${tag}`}
                    onDelete={() => handleTagRemove(tag)}
                    sx={{ marginRight: "10px", marginBottom: "5px" }}
                  />
                ))}
              </div>
            )}

            <input
              type="text"
              placeholder="Enter Tags"
              value={customTag}
              onChange={handleCustomTagChange}
              style={{
                border: "none",
                fontSize: "18px",
                outline: "none",
                minWidth: "100%",
              }}
              onKeyPress={handleKeyPress}
            />
          </Box>

          {suggestedTags?.length > 0 && (
            <Box
              sx={{
                width: "250px",
                height: "auto",
                maxHeight: "300px",
                boxShadow: "5px 10px 15px rgba(0,0,0,0.3)",
                borderRadius: "10px",
                padding: "10px",
                overflow: "auto",
                marginTop: "10px",
              }}
            >
              {suggestedTags?.map((tag, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    setTags((prevTags) => [...  prevTags, tag]);
                    setSuggestedTags([]);
                    setCustomTag("");
                  }}
                  sx={{
                    width: "100%",
                    padding: "5px 8px",
                    cursor: "pointer",
                    ":hover": { backgroundColor: "rgba(0,0,0,0.3)" },
                    borderRadius: "5px",
                  }}
                >
                  {tag}
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            margin: "0px 0 50px",
            backgroundColor: "#1a1aef9c",
            ":hover": { backgroundColor: "#00c1189c" },
          }}
        >
          Add Blog
        </Button>
      </div>

    </div>
  );
}

export default CreateBlog;
