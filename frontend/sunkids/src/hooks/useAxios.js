import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/";

const useAxios = (endpoint, method = "GET", body = null, params = {}, headers = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios({
                    url: `${API_URL}${endpoint}`,
                    method,
                    data: body, // For POST/PUT
                    params, // For GET query parameters
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        ...headers,
                    },
                });
                setData(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [endpoint, method, JSON.stringify(body), JSON.stringify(params)]); // Dependencies to re-fetch when changed

    return { data, loading, error };
};

export default useAxios;
