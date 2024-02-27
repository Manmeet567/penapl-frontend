import axios from 'axios';

export const useUpdate = () => {
    async function updateBlog(id, token) {
        const response = await axios.patch(`${import.meta.env.VITE_BASE_URL}api/updateBlog/${id}`, {
            headers:{
                authorization: `Bearer ${token}`,
            }
        })

        console.log(response?.data)
        
    }
}