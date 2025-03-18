import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";
import "../styles/Login.css"; // Import styles

const Login = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null); // Reset error message

        try {
            const response = await axios.post("http://localhost:8000/account/login/", {
                username,
                password,
            });

            const { access, refresh, user_name, role } = response.data;
            
            // Save tokens in localStorage
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            localStorage.setItem("username", user_name);
            localStorage.setItem("role", role);

            navigate(`/${props.endpoint}`); // Redirect to dashboard after login

            return true;
        } catch (err) {
            setError("اسم المستخدم أو كلمة المرور غير صحيحة!");
        }
    };

    return (
        <div className="login-container">
            <Container className="login-form">
                <h2 className="text-center">تسجيل الدخول</h2>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label>اسم المستخدم</Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>كلمة المرور</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        تسجيل الدخول
                    </Button>
                </Form>
            </Container>
        </div>
    );
};

export default Login;
