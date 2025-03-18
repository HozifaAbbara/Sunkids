import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000/";

const EditableTable = ({ endpoint, searchData, appName, modelName }) => {
    let token = localStorage.getItem("access_token");

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editRow, setEditRow] = useState(null); // Track which row is being edited
    const [editedData, setEditedData] = useState({}); // Store temporary edits
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);


    const fetchColumns = async () => {
        try {
            const response = await axios.get(`${API_URL}columns/${appName}/${modelName}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data) {
                setColumns(response.data.columns); // Assuming the response has a "columns" array
                console.log(columns)
            }
        } catch (error) {
            console.error("Error fetching columns:", error);
        }
    };

    // Fetch data from backend dynamically
    useEffect(() => {
        // Fetch columns and data when component mounts or when endpoint changes
        fetchColumns();

        console.log('BREAKER')

        if (searchData && searchData.length > 0) {
            setData(searchData); // Use search results if available
            setLoading(false);
        } else {
            axios.get(`${API_URL}${endpoint}/`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                    console.log(data)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                });
        }
    }, [endpoint, searchData, appName, modelName]); // Re-run when any of the dependencies change


    // Enable editing for a row
    const handleEditClick = (rowIndex) => {
        setEditRow(rowIndex);
        setEditedData({ ...data[rowIndex] }); // Store initial data
    };

    // Update editedData state when input changes
    const handleInputChange = (columnId, value) => {
        setEditedData((prev) => ({
            ...prev,
            [columnId]: value
        }));
    };

    // Show confirmation modal
    const handleSaveClick = (rowIndex) => {
        setSelectedRow(rowIndex);
        setShowConfirm(true);
    };

    // Handle Confirm Save
    const confirmSave = () => {
        const updatedRow = editedData;
        const rowId = data[selectedRow].id;

        // Send only changed fields
        const changedFields = {};
        columns.forEach(col => {
            if (updatedRow[col] !== data[selectedRow][col]) {
                changedFields[col] = updatedRow[col];
            }
        });

        axios.patch(`${API_URL}${endpoint}/${rowId}/`, changedFields, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                console.log("Update successful:", response.data);
                const newData = [...data];
                newData[selectedRow] = response.data;
                setData(newData);
                setEditRow(null); // Exit edit mode
            })
            .catch((error) => {
                console.error("Error updating data:", error);
            });

        setShowConfirm(false);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col["name"]}>{col["label"]}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id}>
                            {columns.map((col) => ( // Use col instead of columnId
                                <td key={col.name}>
                                    {editRow === rowIndex ? (
                                        <Form.Control
                                            type="text"
                                            value={editedData[col.name] || ""}
                                            onChange={(e) =>
                                                handleInputChange(col.name, e.target.value)
                                            }
                                        />
                                    ) : (
                                        row[col.name] && typeof row[col.name] === "object"
                                            ? row[col.name].id // If it's an object, show its ID
                                            : row[col.name] // Otherwise, show the value
                                    )}
                                </td>
                            ))}
                            <td>
                                {editRow === rowIndex ? (
                                    <>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            onClick={() => handleSaveClick(rowIndex)}
                                        >
                                            Save
                                        </Button>
                                        {" "}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setEditRow(null)}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleEditClick(rowIndex)}
                                    >
                                        Edit
                                    </Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Confirmation Modal */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Changes</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to save changes?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={confirmSave}>
                        Yes, Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditableTable;
