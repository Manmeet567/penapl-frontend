import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthContext } from "../../hooks/useAuthContext";

export const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();
    const { userData } = useAuthContext();
    // const userData = JSON.parse(localStorage.getItem("userData"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) {
            toast.error("You need to login first");
            navigate("/login");
        }
        setLoading(false);
    }, [userData]);

    if (loading) {
        return <p>Loading . . .</p>; // Or some loading indicator if needed
    }

    return userData ? children : null;
};


export const UnprotectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { userData } = useAuthContext();

    useEffect(() => {
        if (userData) {
            navigate("/blog-app");
        }
    }, [userData, navigate]);

    return children;
};