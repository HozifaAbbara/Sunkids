import React from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const HeaderItem = ({ onClick, text, subitems = [], setEndPoint , setAppName, setModelName}) => {
    const navigate = useNavigate();

    const handleNavigation = (path, endpoint, appName, modelName) => {
        setEndPoint(endpoint); // Update API endpoint
        setAppName(appName);
        setModelName(modelName);
        navigate(path, { replace: true }); // Properly replace history entry
    };

    return subitems.length === 0 ? (
        <button
            style={{
                borderRadius: "6px",
                backgroundColor: "#8affff",
                border: "1px solid #7d7f7f",
                color: "black",
                margin: "12px",
                padding: "6px"
            }}
            onClick={onClick}
        >
            تسجيل الخروج
        </button>
    ) : (
        <Dropdown>
            <Dropdown.Toggle
                variant="primary"
                id="dropdown-basic"
                style={{
                    borderRadius: "6px",
                    backgroundColor: "#8affff",
                    border: "1px solid #7d7f7f",
                    color: "black",
                    margin: "12px",
                }}
            >
                {text}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {subitems.map(([label, path, appName, modelName], index) => (
                    <Dropdown.Item
                        key={index}
                        onClick={() => handleNavigation(`/${path}`, path, appName, modelName)}
                    >
                        {label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default HeaderItem;
