import React from "react";
import { Row, Col, Image, Button } from 'react-bootstrap';
import HeaderItem from "./HeaderItem";
import logo from '../assets/sunkids logo.png';
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('access_token')
        navigate('/')
    }

    return (
        <Row 
            xs="auto" 
            className="align-items-center px-3 flex-row" 
            style={{ backgroundColor: '#ffff7a', padding: '15px 0px', display: 'flex', justifyContent: 'space-between' }}
        >
            {/* Menu Items (Should be on the right in RTL) */}
            <Col className="d-flex gap-3">
                <HeaderItem text="الاستقبال " subitems={["الاستقبال", "التسعير"]} />
                <HeaderItem text="البطاقات " subitems={["البطاقات", "البطاقات المباعة", "استهلاك البطاقات"]} />
                <HeaderItem text="الأطفال " subitems={["الأطفال", "الأقرباء"]} />
                <HeaderItem text="المشتريات " subitems={["عناصر السوبرماركت", "مشتريات الطفل"]} />
            </Col>

            {/* Logo (Should be on the left in RTL) */}
            <Col className="logo-container">
                <HeaderItem onClick={logout}>logout</HeaderItem>
                <Image src={logo} alt="Sunkids Logo" width={77} height={70} />
            </Col>
        </Row>
    );
};

export default Header;
