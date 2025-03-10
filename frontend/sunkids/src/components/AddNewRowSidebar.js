import React, { useState } from "react";
import { Button, Offcanvas, Form } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000/";

const AddNewRowSidebar = ({ endpoint, onAdd }) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const toggleSidebar = () => setShow(!show);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        axios.post(`${API_URL}${endpoint}/`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        })
            .then((response) => {
                onAdd(response.data); // Add new row to the table
                toggleSidebar(); // Close sidebar
            })
            .catch((error) => console.error("Error adding new row:", error))
            .finally(() => setLoading(false));
    };

    return (
        <>
            <Button variant="success" onClick={toggleSidebar}>+ Add New</Button>

            <Offcanvas show={show} onHide={toggleSidebar} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Add New Entry</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" name="first_name" onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" name="last_name" onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phone_number" onChange={handleChange} required />
                        </Form.Group>

                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

export default AddNewRowSidebar;
