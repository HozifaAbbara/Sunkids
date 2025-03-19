import React, { useEffect, useState } from "react";
// import { Container, Col, Row } from 'react-bootstrap';
import Header from "../components/Header";
// import EditableTable from "../components/EditableTable";
// import { Routes, Route } from 'react-router-dom';
import DataHandler from "./DataHandler";
import { useLocation } from "react-router-dom";
// import SidBar from "../components/SidBar";


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


const AppLayout = (props) => {

    const location = useLocation();

    const getAppAndModel = (endpoint) => {
        for (const category in subitems) {
            for (const [_, itemEndpoint, app, model] of subitems[category]) {
                if (itemEndpoint === endpoint) {
                    return { appName: app, modelName: model };
                }
            }
        }
        return { appName: "", modelName: "" };  // Default if not found
    };

    useEffect(() => {
        const path = location.pathname.slice(1); // Remove leading "/"
        const { appName, modelName } = getAppAndModel(path);

        if (appName && modelName) {
            props.setEndPoint(path);
            props.setAppName(appName);
            props.setModelName(modelName);
        }
    }, [location.pathname]);


    return (
        <>
            <Header setEndPoint={props.setEndPoint} setAppName={props.setAppName} setModelName={props.setModelName} subitems={subitems} />
            <DataHandler endpoint={props.endpoint} appName={props.appName} modelName={props.modelName} />
        </>
    );
};

export default AppLayout;