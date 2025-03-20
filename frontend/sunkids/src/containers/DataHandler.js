import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import EditableTable from "../components/EditableTable";
import AddNewRowSidebar from "../components/AddNewRowSidebar";

const DataHandler = (props) => {
    const [searchResults, setSearchResults] = useState([]);
    const [columns, setColumns] = useState([]);

    return (
        <div>
            {/* <h2>Search & Edit Data</h2> */}
            <SearchBar endpoint={props.endpoint} onSearchResults={setSearchResults} />
            <div style={{
                maxHeight: "300px",
                overflowY: "auto",
            }}>
                <EditableTable endpoint={props.endpoint} searchData={searchResults} appName={props.appName}
                    modelName={props.modelName} columns={columns} setColumns={setColumns} />
            </div>
            <AddNewRowSidebar endpoint={props.endpoint} formFields={columns} API_URL={'http://localhost:8000'}/>
        </div>
    );
};

export default DataHandler;
