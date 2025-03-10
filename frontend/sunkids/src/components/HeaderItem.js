import React from "react";
import { Button, Dropdown } from "react-bootstrap";

const HeaderItem = (props) => {

    const subitems = props.subitems || []; // If not provided, default to an empty array

    return (
        subitems.length === 0 ? (
            <button
                style={{
                    borderRadius: "6px",
                    backgroundColor: "#8affff",
                    border: "1px solid #7d7f7f",
                    color: "black",
                    margin: "12px",
                    padding: '6px'
                }}
                onClick={props.onClick}
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
                    {props.text}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {props.subitems.map((item, index) => (
                        <Dropdown.Item key={index} href="/pricing">
                            {item}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        )
    );
};

export default HeaderItem;
