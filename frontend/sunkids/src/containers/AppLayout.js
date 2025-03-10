import React from "react";
// import { Container, Col, Row } from 'react-bootstrap';
import Header from "../components/Header";
// import EditableTable from "../components/EditableTable";
// import { Routes, Route } from 'react-router-dom';
import DataHandler from "./DataHandler";
// import SidBar from "../components/SidBar";

const AppLayout = () => {
    return (
        <>
            <Header />
            <DataHandler endpoint='account/parents' />

        </>
    );
};

export default AppLayout;