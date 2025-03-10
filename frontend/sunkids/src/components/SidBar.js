import React from "react";
import { Col, Row } from "react-bootstrap";
import SideBarItem from "./SideBarItem";

const SidBar = () => {
    return <Col xs={2} style={{backgroundColor:'blue', height:'90vh'}}>
        <Row>
            <SideBarItem text='ادخال يومي'/>
            <SideBarItem text='ادخال يومي'/>
            <SideBarItem text='ادخال يومي'/>
        </Row>
    </Col>
}

export default SidBar;