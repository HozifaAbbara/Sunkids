import React, { useState } from "react";
// import { Container, Col, Row } from 'react-bootstrap';
import Header from "../components/Header";
// import EditableTable from "../components/EditableTable";
// import { Routes, Route } from 'react-router-dom';
import DataHandler from "./DataHandler";
// import SidBar from "../components/SidBar";

const AppLayout = (props) => {

    return (
        <>
            <Header setEndPoint={props.setEndPoint} setAppName={props.setAppName} setModelName={props.setModelName} />
            <DataHandler endpoint={props.endpoint} appName={props.appName} modelName={props.modelName} />
        </>
    );
};

export default AppLayout;