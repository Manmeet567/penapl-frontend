import { useState } from "react";
import { useAuthContext } from './useAuthContext'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}auth/login`, {
                email, password
            });

            if (response.status === 200) {
                setLoading(false);
                dispatch({ type: "LOGIN", payload: response.data });
                localStorage.setItem('userData', JSON.stringify(response.data));
                navigate("/blog-app");
            } else {
                setLoading(false);
                setError("An error occurred while logging in."); // Generic error message
            }
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error); // Capture the error message from the API
            } else {
                setError("An error occurred while logging in.");
            }
        }
    }

    return { login, error, loading };
}
