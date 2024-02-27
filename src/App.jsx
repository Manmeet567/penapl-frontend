import { Route, BrowserRouter, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Blogs from "./pages/Blogs";
import NotFound from "./components/NotFound/NotFound";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import BlogsByYou from "./pages/BlogsByYou";
import UpdateBlog from "./pages/UpdateBlog";
import SearchResults from "./pages/SearchResults";
import Bookmarks from "./pages/Bookmarks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import TextEditor from "./components/Editor/Editor";
import { PrivateRoute,UnprotectedRoute } from "./components/PrivateRoute/PrivateRoute";
import Editor2 from "./components/Editor2/Editor2";
import BlogUpdate from "./components/UpdateEditor/BlogUpdate";

function App() {

  return (
    <BrowserRouter>
      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={<UnprotectedRoute><Home /></UnprotectedRoute>}
          />
          <Route
            path="/login"
            element={<UnprotectedRoute><Login /></UnprotectedRoute>}
          />
          <Route
            path="/signup"
            element={<UnprotectedRoute><Signup /></UnprotectedRoute>}
          />
          <Route
            path="/createBlog"
            element={<PrivateRoute ><CreateBlog /></PrivateRoute>}
          />
          <Route
            path="/blog-app"
            element={<Blogs />}
          />

          <Route path="/search-blog/:query" element={<SearchResults />}/>

          <Route
            path="/blog/:slug"
            element={<BlogDetail />}
          />

          <Route
            path="/blog/update/:id"
            element={<PrivateRoute><UpdateBlog /></PrivateRoute>}
          />

          <Route 
            path="/bookmarks"
            element={<PrivateRoute><Bookmarks /></PrivateRoute>}
          />

          <Route
            path={`/yourBlogs`}
            element={<PrivateRoute><BlogsByYou /></PrivateRoute>}
          />

          <Route path="/editor" element={<PrivateRoute><Editor2 /></PrivateRoute>} />
          <Route path="/blog/update-editor/:id" element={<PrivateRoute><BlogUpdate /></PrivateRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
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
    </BrowserRouter>
  );
}

export default App;
