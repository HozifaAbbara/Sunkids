import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import useAxios from '../hooks/useAxios';
import debounce from 'lodash/debounce'; // To debounce the search query

const AddNewChildForm = ({ API_URL }) => {
    const [parents, setParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedParent, setSelectedParent] = useState(null);

    // This is the function that triggers when user types in the Select input field
    const handleSearchChange = (inputValue) => {
        setSearchQuery(inputValue); // Update the search query
    };

    // This function is called when a parent is selected
    const handleSelectChange = (selectedOption) => {
        setSelectedParent(selectedOption); // Set the selected parent object
    };

    // Fetch parents based on the search query
    const { data, loading, error } = useAxios(
        `account/parents/`, // endpoint for search
        "GET",
        null,
        { search: searchQuery } // pass the search query as a parameter
    );

    // UseEffect to update the parents once data is fetched
    useEffect(() => {
        if (data) {
            setParents(data); // Set the parents to state once the data is fetched
            console.log(data)
        }
    }, [data]);

    // Debounce the search query to avoid sending too many requests
    const debouncedSearch = debounce(handleSearchChange, 500); // Delay 500ms after typing before making a request


    const handleSubmit = () => {

    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Parent</Form.Label>
                <Select
                    name="parent"
                    options={parents.map((parent) => ({
                        value: parent.id,
                        label: parent.username, // Assuming `name` is the parent name
                    }))}
                    onChange={handleSelectChange}
                    onInputChange={debouncedSearch} // Attach the debounced search
                    value={selectedParent} // Controlled value for the selected parent
                    isSearchable
                    placeholder="Search and select parent"
                    required
                />
            </Form.Group>

            <button type="submit" disabled={loading}>Submit</button>
        </Form>
    );
};

export default AddNewChildForm;
