import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import axios from "axios";
import AddNewChildForm from "./AddNewChildForm";
// import AddNewParentForm from "./AddNewParentForm";
// import AddNewMarketItemForm from "./AddNewMarketItemForm";

const AddNewRowSidebar = ({ apiUrl, onAdd, API_URL }) => {
    const [show, setShow] = useState(false);
    const [selectedType, setSelectedType] = useState(null);

    const toggleSidebar = () => setShow(!show);

    const handleTypeSelect = (type) => {
        setSelectedType(type);
        setShow(true);
    };

    const handleFormSubmit = (endpoint, formData) => {
        axios.post(`${apiUrl}${endpoint}/`, formData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
        })
            .then((response) => {
                onAdd(response.data);
                setShow(false); // Close sidebar after submission
            })
            .catch((error) => console.error("Error adding new row:", error));
    };

    return (
        <>
            <Dropdown>
                <Dropdown.Toggle variant="success">
                    + Add New
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleTypeSelect("child")}>Child</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTypeSelect("parent")}>Parent</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleTypeSelect("marketItem")}>Market Item</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            {/* Sidebar */}
            <div className={`sidebar ${show ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h5>Add New {selectedType}</h5>
                    <Button variant="close" onClick={() => setShow(false)} />
                </div>
                <div className="sidebar-body">
                    {selectedType === "child" && <AddNewChildForm onSubmit={handleFormSubmit} onAdd={onAdd} API_URL={API_URL}/>}
                    {/* {selectedType === "parent" && <AddNewParentForm onSubmit={handleFormSubmit} />}
                    {selectedType === "marketItem" && <AddNewMarketItemForm onSubmit={handleFormSubmit} />} */}
                </div>
            </div>

            {/* Sidebar Styles */}
            <style>
                {`
                    .sidebar {
                        position: fixed;
                        top: 0;
                        right: -350px;
                        width: 350px;
                        height: 100%;
                        background: white;
                        box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                        transition: right 0.3s ease-in-out;
                        z-index: 1050;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                    }
                    .sidebar.open {
                        right: 0;
                    }
                    .sidebar-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 10px;
                    }
                    .sidebar-body {
                        flex-grow: 1;
                        overflow-y: auto;
                        padding-top: 15px;
                    }
                `}
            </style>
        </>
    );
};

export default AddNewRowSidebar;
