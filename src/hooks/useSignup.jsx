import { useState } from "react";
import { useAuthContext } from './useAuthContext'
import axios from 'axios';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const { dispatch } = useAuthContext();

    const signup = async (email, username, password) => {
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/signup`, {
                email, username, password
            });

            if (response.status === 200) {
                setLoading(false);
                dispatch({ type: "LOGIN", payload: response.data });
                localStorage.setItem('userData', JSON.stringify(response.data));
            } else {
                setLoading(false);
                setError("An error occurred while signing up."); // Generic error message
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error); // Capture the error message from the API
            } else {
                setError("An error occurred while signing up.");
            }
        }
    }

    return { signup, error, loading };
}
