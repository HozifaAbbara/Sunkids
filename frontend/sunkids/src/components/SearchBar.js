import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000/";

const SearchBar = ({ endpoint, onSearchResults }) => {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        axios.get(`${API_URL}${endpoint}/?search=${query}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        })
            .then((response) => {
                onSearchResults(response.data); // Pass results to parent component
            })
            .catch((error) => {
                console.error("Search error:", error);
                onSearchResults([]); // Clear results on error
            });
    };

    return (
        <InputGroup className="mb-3">
            <Form.Control
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>
        </InputGroup>
    );
};

export default SearchBar;
