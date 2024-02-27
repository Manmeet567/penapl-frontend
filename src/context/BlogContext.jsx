import { createContext, useReducer } from "react";

export const BlogContext = createContext();

export const blogReducer = (state, action) => {
  switch (action.type) {
    case "BLOGS":
      // console.log("CASE - BLOGS : ", action.payload)
      return {
        blogs: action.payload,
      };

    case "UPDATE_BLOGS":
      const updatedBlog = action.payload;

      const updatedBlogs = state.blogs.map((blog) =>
        blog._id === updatedBlog._id ? updatedBlog : blog
      );

      return {
        blogs: updatedBlogs,
      };

    case 'DELETE_BLOG':
      return {
        blogs: state.blogs.filter((blog)=>blog._id !== action.payload._id)
      }

      case "ADD_BLOGS":
        const newBlogs = action.payload;
        const mergedBlogs = [...state.blogs];
      
        newBlogs.forEach((newBlog) => {
          const existingBlogIndex = mergedBlogs.findIndex(
            (blog) => blog._id === newBlog._id
          );
          
          if (existingBlogIndex !== -1) {
            mergedBlogs[existingBlogIndex] = newBlog;
          } else {
            mergedBlogs.push(newBlog);
          }
        });
      
        return {
          blogs: mergedBlogs,
        };

        case "SEARCH":
          return {
            ...state,
            search: action.payload, // Assuming action.payload is a string
          };
        
    default:
      return state;
  }
};

export const BlogContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(blogReducer, {
    blogs: null,
  });

  return (
    <BlogContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BlogContext.Provider>
  );
};
