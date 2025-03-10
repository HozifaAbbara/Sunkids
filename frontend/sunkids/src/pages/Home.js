import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = (props) => {

    const navigate = useNavigate();

    return (
        <>
        <h1>Welcom to sunkids</h1>

        <Button onClick={() => navigate("/reception")}>!Login</Button>
        </>
    )
}

export default Home;