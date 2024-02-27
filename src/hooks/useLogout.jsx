import { useAuthContext } from "./useAuthContext";
import { useBlogContext } from "./useBlogContext";

export const useLogout = () => {

    const { dispatch } = useAuthContext();
    const {dispatch:blogsDispatch} = useBlogContext();

    const logout = () => {
        localStorage.removeItem('userData')

        dispatch({type:'LOGOUT'})
        // blogsDispatch({type:'BLOGS', payload:null})
    }

    return {logout}
}