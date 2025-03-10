import React, { useState, useEffect } from "react";
import { Table, Form, Button, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000/";

const EditableTable = ({ endpoint, searchData }) => {
    let token = localStorage.getItem("access_token");

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editRow, setEditRow] = useState(null); // Track which row is being edited
    const [editedData, setEditedData] = useState({}); // Store temporary edits
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    // Fetch data from backend dynamically
    useEffect(() => {
        axios.get(`${API_URL}${endpoint}/`, {
            // axios.get(`http://localhost:8000/account/parents/`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((response) => {
                if (response.data.length > 0) {
                    setColumns(Object.keys(response.data[0]));
                }
                setData(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, [endpoint]);

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
                            <th key={col}>{col}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={row.id}>
                            {columns.map((columnId) => (
                                <td key={columnId}>
                                    {editRow === rowIndex ? (
                                        <Form.Control
                                            type="text"
                                            value={editedData[columnId] || ""}
                                            onChange={(e) =>
                                                handleInputChange(columnId, e.target.value)
                                            }
                                        />
                                    ) : (
                                        typeof row[columnId] === "object"
                                            ? row[columnId].id // Convert object to string
                                            : row[columnId]
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
