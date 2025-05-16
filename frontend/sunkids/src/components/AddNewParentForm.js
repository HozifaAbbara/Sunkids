import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const initialFormData = {
    first_name: '',
    last_name: '',
    // username: '',
    phone_number: '',
    password: '',
    gender: '',
    nationality: '',
    address: '',
    work_phone: '',
};

const AddNewParentForm = ({ API_URL }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            account: {
                // username: formData.username,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone_number: formData.phone_number,
                gender: formData.gender,
            },
            nationality: formData.nationality,
            address: formData.address,
            work_phone: formData.work_phone,
        };

        console.log(payload)

        axios
            .post(`${API_URL}/account/parents/`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((res) => {
                console.log("Parent created successfully:", res.data);
            })
            .catch((err) => {
                console.error("Error creating parent:", err.response?.data || err.message);
            });
    };


    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control name="first_name" value={formData.first_name} onChange={handleChange} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control name="last_name" value={formData.last_name} onChange={handleChange} required />
                    </Form.Group>
                </Col>
            </Row>

            {/* <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control name="username" value={formData.username} onChange={handleChange} required />
            </Form.Group> */}

            <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control type="text"
                    name="phone_number"
                    placeholder="+963931234567" value={formData.phone_number} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Nationality</Form.Label>
                <Form.Control name="nationality" value={formData.nationality} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control name="address" value={formData.address} onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Work Phone</Form.Label>
                <Form.Control name="work_phone" value={formData.work_phone} onChange={handleChange} />
            </Form.Group>

            {errorMsg && <p className="text-danger">{errorMsg}</p>}

            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Parent"}
            </Button>
        </Form>
    );
};

export default AddNewParentForm;
