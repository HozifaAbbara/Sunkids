import React from "react";
import { Row, Col, Image } from "react-bootstrap";
import HeaderItem from "./HeaderItem";
import logo from "../assets/sunkids logo.png";
import { useNavigate } from "react-router-dom";

const Header = ({ setEndPoint, setAppName, setModelName }) => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("access_token");
        navigate("/");
    };

    const subitems = {
        الاستقبال: [
            ["الاستقبال", "attendance/attendance", 'attendance', 'Attendance'],
            ["التسعير", "attendance/hour-pricing", 'attendance', 'HourPricing'],
        ],
        البطاقات: [
            ["البطاقات", "card/cards", 'card', 'Card'],
            ["البطاقات المباعة", "card/sold-cards", 'card', 'SoldCards'],
            ["استهلاك البطاقات", "card/card/consumption", 'card', 'CardConsumption'],
        ],
        الاطفال: [
            ["الاطفال", "child/children", 'child', 'Child'],
            ["الاقرباء", "child/relationships", 'child', 'Relationship'],
        ],
        المشتريات: [
            ["عناصر السوبرماركت", "market/market-items", 'market', 'MarketItem'],
            ["مشتريات الطفل", "market/sold-items", 'market', 'SoldItems'],
        ],
        الحسابات: [
            ["الموظفون", "account/employees", 'account', 'Employee'],
            ["الاهالي", "account/parents", 'account', 'Parent'],
        ],
    };

    return (
        <Row
            xs="auto"
            className="align-items-center px-3 flex-row"
            style={{
                backgroundColor: "#ffff7a",
                padding: "15px 0px",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            {/* Menu Items */}
            <Col className="d-flex gap-3">
                {Object.entries(subitems).map(([category, items]) => (
                    <HeaderItem
                        key={category}
                        text={category}
                        subitems={items}
                        setEndPoint={setEndPoint}
                        setAppName={setAppName}
                        setModelName={setModelName}
                    />
                ))}
            </Col>

            {/* Logo and Logout */}
            <Col className="logo-container d-flex align-items-center gap-3">
                <HeaderItem onClick={logout} text="تسجيل الخروج" />
                <Image src={logo} alt="Sunkids Logo" width={77} height={70} />
            </Col>
        </Row>
    );
};

export default Header;
