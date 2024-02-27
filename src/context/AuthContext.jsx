import { createContext , useReducer , useEffect } from 'react'

export const AuthContext = createContext()

export const authReducer = (state,action) => {
    switch(action.type){
        case 'LOGIN':
            return {
                userData: action.payload
            }

        case 'LOGOUT':
            return { userData:null }


        case 'ADD_BOOKMARK':
            if (!state.userData) return state;
          
            const updatedUser = {
                ...state.userData,
                user:{
                    ...state.userData.user,
                    bookmarks: [...state.userData.user.bookmarks, action.payload]
                }
                
            };
          
            return {
                userData: updatedUser
            };

        case 'REMOVE_BOOKMARK':
            if (!state.userData) return state;
          
            const updatedUserRemove = {
                ...state.userData,
                user:{
                    ...state.userData.user,
                    bookmarks: state.userData.user.bookmarks.filter(blogId => blogId !== action.payload)
                }
            };
          
            return {
                userData: updatedUserRemove
            };
            
        default:
            return state
    }
}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        userData:null
    })

    useEffect(() => {
        const userData  = JSON.parse(localStorage.getItem('userData'))

        if(userData) {
            dispatch({ type:'LOGIN', payload:userData })
        }
    }, [])

    // console.log('AuthContext State: ', state) 

    return (
        <AuthContext.Provider value={{...state, dispatch}} >
            {children}
        </AuthContext.Provider>
    )
}