import React, { useState } from "react";
import { Button, Offcanvas, Form } from "react-bootstrap";
import axios from "axios";

const AddNewRowSidebar = ({ apiUrl, endpoint, formFields, onAdd }) => {
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
                onAdd(response.data); // Add new row to the table
                toggleSidebar(); // Close sidebar
            })
            .catch((error) => console.error("Error adding new row:", error))
            .finally(() => setLoading(false));
    };

    return React.createElement(
        React.Fragment,
        null,
        React.createElement(Button, { variant: "success", onClick: toggleSidebar }, "+ Add New"),

        React.createElement(
            Offcanvas,
            { show: show, onHide: toggleSidebar, placement: "end" },
            React.createElement(
                Offcanvas.Header,
                { closeButton: true },
                React.createElement(Offcanvas.Title, null, "Add New Entry")
            ),
            React.createElement(
                Offcanvas.Body,
                null,
                React.createElement(
                    Form,
                    { onSubmit: handleSubmit },
                    formFields.map((field, index) =>
                        React.createElement(
                            Form.Group,
                            { key: index, className: "mb-3" },
                            React.createElement(Form.Label, null, field.label),
                            React.createElement(Form.Control, {
                                type: field.type || "text",
                                name: field.name,
                                onChange: handleChange,
                                required: field.required || false
                            })
                        )
                    ),
                    React.createElement(
                        Button,
                        { variant: "primary", type: "submit", disabled: loading },
                        loading ? "Saving..." : "Save"
                    )
                )
            )
        )
    );
};

export default AddNewRowSidebar;
