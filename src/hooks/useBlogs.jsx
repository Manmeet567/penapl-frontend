import { useState } from 'react';
import { useAuthContext } from './useAuthContext'
import {useBlogContext} from './useBlogContext';
import axios from 'axios'


export const useBlogs = (start) => {
    // const { userData } = useAuthContext();
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)
    const [total, setTotal] = useState(0);

    const {blogs,dispatch} = useBlogContext();

    const getBlogs = async () => {
        setLoading(true)
        if(blogs){
            dispatch({type:'BLOGS', payload:null})
        }
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}api/blogs`, {start})
        // {
        //     headers:{
        //         authorization:`Bearer ${userData.token}`
        //     }
        // }

        if(response.status === 200){
            setLoading(false);
            setData(response.data.blogs)
            setTotal(response.data.total)
            dispatch({type:'BLOGS', payload:response.data.blogs})
        }
        if(response.status!==200) {
            setLoading(false);
            setError(response.data.error);
        }
    }

    return {getBlogs,data ,loading, error, total}
}