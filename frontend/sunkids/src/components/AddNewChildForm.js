import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Select from 'react-select';
import useAxios from '../hooks/useAxios';
import debounce from 'lodash/debounce'; // To debounce the search query
import axios from 'axios';

const formFields = [
    {
        name: "first_name",
        label: "First Name",
        type: "text",
        required: true,
    },
    {
        name: "last_name",
        label: "Last Name",
        type: "text",
        required: true,
    },
    {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        required: true,
    },
    {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: [
            { value: "MALE", label: "Male" },
            { value: "FEMALE", label: "Female" },
        ],
    },
    {
        name: "address",
        label: "Address",
        type: "text",
        required: true,
    },
    {
        name: "school",
        label: "School",
        type: "text",
        required: false,
    },
    {
        name: "notes",
        label: "Notes",
        type: "textarea",
        required: false,
    },
];

const AddNewChildForm = ({ API_URL }) => {
    const [parents, setParents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedParent, setSelectedParent] = useState(null);

    const [formData, setFormData] = useState({});
    const handleChange = (e) => {
        let { name, value } = e.target;

        // Convert date to YYYY-MM-DD format
        if (name === "date_of_birth") {
            value = new Date(value).toISOString().split("T")[0];
        }

        setFormData({ ...formData, [name]: value });
    };

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


    const handleSubmit = (event) => {
        event.preventDefault();
        setFormData({ ...formData, 'parent': selectedParent.value.id });
        console.log(formData)
        axios.post(`${API_URL}/child/children/`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Parent</Form.Label>
                <Select
                    name="parent"
                    options={parents.map((parent) => ({
                        value: parent,
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

            {(formFields || []).map((field, index) => (
                <Form.Group key={index} className="mb-3">
                    <Form.Label>{field.label}</Form.Label>

                    {field.type === "select" ? (
                        // Use Form.Select for dropdowns
                        <Form.Select
                            name={field.name}
                            onChange={handleChange}
                            required={field.required || false}
                            value={formData[field.name] || ""}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((option, i) => (
                                <option key={i} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Form.Select>
                    ) : field.type === "textarea" ? (
                        // Use Form.Control as textarea
                        <Form.Control
                            as="textarea"
                            name={field.name}
                            onChange={handleChange}
                            required={field.required || false}
                            value={formData[field.name] || ""}
                        />
                    ) : (
                        // Default case for text, date, number, etc.
                        <Form.Control
                            type={field.type || "text"}
                            name={field.name}
                            onChange={handleChange}
                            required={field.required || false}
                            value={formData[field.name] || ""}
                        />
                    )}
                </Form.Group>
            ))}

            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </Button>

        </Form>
    );
};

export default AddNewChildForm;
