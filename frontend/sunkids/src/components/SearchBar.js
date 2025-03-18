import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import useAxios from "../hooks/useAxios"; // Assuming useAxios is a custom hook

const SearchBar = ({ endpoint, onSearchResults }) => {
    const [query, setQuery] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // state for search query
    
    // Call useAxios hook and pass the updated search query
    const { data, loading, error } = useAxios(
        `${endpoint}/`, // endpoint for search
        "GET",
        null,
        { search: searchQuery } // pass the search query as a parameter
    );

    // Update search query whenever the user types in the input
    useEffect(() => {
        if (data) {
            onSearchResults(data); // Pass data to the parent component when it is fetched
        }
    }, [data, onSearchResults]); // Only trigger this effect when data changes

    // Trigger search when the user clicks the search button
    const handleSearch = () => {
        setSearchQuery(query); // Set the search query to trigger the axios request
    };

    // Handle query input change
    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    // Handle any error in search
    useEffect(() => {
        if (error) {
            console.error("Search error: ", error);
            onSearchResults([]); // Pass empty array if error occurs
        }
    }, [error, onSearchResults]); // Effect on error change

    return (
        <InputGroup className="mb-3">
            <Form.Control
                type="text"
                placeholder="Search..."
                value={query}
                onChange={handleInputChange}
            />
            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>
        </InputGroup>
    );
};

export default SearchBar;
