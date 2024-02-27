import { useEffect, useState } from "react";
import { useLogout } from "../../hooks/useLogout";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { useBlogContext } from "../../hooks/useBlogContext";
import logo from '../../assets/blog-app-logo.png';

function Navbar() {
  const { userData } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const { dispatch } = useBlogContext();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  }

  const [searchQuery, setSearchQuery] = useState('');
  // useEffect(() => {console.log(searchQuery)}, [searchQuery])

  const handleSearch = () => {
    if (searchQuery) {
      const encodedQuery = encodeURIComponent(searchQuery); 
      navigate(`/search-blog/${encodedQuery}`);
    }
    
  }

  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  }

  useEffect(() => {
    const currentRoute = location.pathname;
    if (currentRoute.startsWith('/search-blog/')) {
      const query = decodeURIComponent(currentRoute.replace('/search-blog/', ''));
      setSearchQuery(query);
      dispatch({ type: "SEARCH", payload: query });
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500); 

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery]);


  return (
    <div className="navbar">
      <div className="navbar-inner-content">
        <div className="logo">
          <Link to="/blog-app"><img src={logo} alt="Somthing" className="nav-img-logo"/></Link>
        </div>

        <div className="items">
          <div className="item">


          <div className="oafdjg"  style={{ border: '1px solid #000', outline: "none", borderRadius: "150px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent:"center" }}>
            <input
              // className={show || searchIcon ? 'search-bar show' : 'search-bar'}
              className="search-bar"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              type="text"
              placeholder="Search by title or tags"
            />

            <BiSearch style={{ fontSize: "44px", padding: "6px 8px 4px 10px",  cursor: "pointer" }} />
          </div>
          </div>
          <div className="item">
            <Link to="/blog-app">Blogs</Link>
          </div>
          <div className="item">
            <Link to="/editor">Create Blog</Link>
          </div>

          <div className="item">
            <Link to="/bookmarks">Bookmarks</Link>
          </div>

          {userData && <Link to='/yourBlogs'><div className="item" style={{ cursor: "pointer", color: 'black' }}>{userData?.user.username}</div></Link>}

          <div className="item">
            {userData && <Button variant="contained" style={{ padding: '4px 8px', backgroundColor: "#333" }} onClick={handleLogout}>Logout</Button>}
            {!userData && <Link to='/login' ><Button variant="contained" style={{ padding: '4px 8px', cursor: "pointer", backgroundColor: "#333" }}>Log In</Button></Link>}
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Navbar;


