import React, { useState } from "react";
import { Button, Offcanvas, Form } from "react-bootstrap";
import axios from "axios";
import AddNewChildForm from "./AddNewChildForm";

const AddNewRowSidebar = ({ apiUrl, endpoint, formFields = [], onAdd }) => {
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

        axios.post(`${apiUrl}${endpoint}/`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        })
            .then((response) => {
                onAdd(response.data);
                toggleSidebar();
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
                    <AddNewChildForm/>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
};

AddNewRowSidebar.defaultProps = {
    formFields: []
};

export default AddNewRowSidebar;
