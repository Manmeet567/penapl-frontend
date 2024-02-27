import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Box } from '@mui/material';
import Blog from '../components/Blog/Blog';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Pagination} from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/pagination';
import { useBlogContext } from '../hooks/useBlogContext';

function SearchResults() {

  const {query} = useParams();
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState(null);
  const {search, dispatch} = useBlogContext();


  // useEffect(() => {
  //   dispatch({ type: "SEARCH", payload: query });
  // }, [query]);


  useEffect(() => {

    const handleSearchResult = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}api/search-blogs/${query}`);
        if(response.status == 200){
          setBlogs(response.data);
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        toast.error("Something Went Wrong!");
        setLoading(false);
      }
    }

    if(query){
      handleSearchResult();
    }
  }, [query])

  return (
   <div className="searchResults">
    <Navbar />

    <div
        className="blogContent-search"
        style={{ maxWidth: "1000px", paddingTop: "100px", margin: "0px auto" }}
    >
      {loading && <div className="loading"><p style={{fontSize:'30px'}}>Loading . . . </p></div>} 

      {blogs?.with_title?.length === 0 ? 
        <Box>
          <p style={{padding:"10px 20px 0", fontSize:"18px"}}>Showing results for <b style={{color:'blue'}}><i>{search}</i></b></p>
          <h2 style={{padding:"10px 20px 0"}}>No search results.</h2>
        </Box> : 
        <Box>
          <p style={{padding:"10px 20px 0", fontSize:"18px"}}>Showing results for <b style={{color:'blue'}}><i>{search}</i></b></p>

          <Swiper
          style={{paddingBottom:"20px"}}
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            pagination={{ clickable: true }}
          >
            {blogs?.with_title?.map((blog, index) => (
              <SwiperSlide><Blog data={blog} key={index} /></SwiperSlide>
            ))}
          </Swiper>
          
        </Box>
      }

      <hr style={{margin:"30px 20px"}}/>

      {blogs?.with_tag?.length === 0 ?
        <Box>
          <p style={{padding:"10px 20px 0", fontSize:"18px"}}>Showing results for <b style={{color:'blue'}}><i>{search}</i></b></p>
          <h2 style={{padding:"10px 20px 0"}}>No search results.</h2>
        </Box> :
        <Box>
          <p style={{padding:"10px 20px 0", fontSize:"18px"}}>Showing results for blogs tagged <b style={{color:'blue'}}><i>{search}</i></b></p>

          <Swiper
          style={{paddingBottom:"20px"}}
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={2}
            pagination={{ clickable: true }}
          >
            {blogs?.with_tag?.map((blog, index) => (
              <SwiperSlide><Blog data={blog} key={index} /></SwiperSlide>
            ))}
          </Swiper>
        </Box>
      } 

    </div>


   </div>
  )
}

export default SearchResults
