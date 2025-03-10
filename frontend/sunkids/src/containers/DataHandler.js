import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import EditableTable from "../components/EditableTable";
import AddNewRowSidebar from "../components/AddNewRowSidebar";

const DataHandler = (props) => {
    const [searchResults, setSearchResults] = useState([]);

    return (
        <div>
            {/* <h2>Search & Edit Data</h2> */}
            <SearchBar endpoint={props.endpoint} onSearchResults={setSearchResults} />
            <div style={{
                maxHeight: "300px",
                overflowY: "auto",
            }}>
                <EditableTable endpoint={props.endpoint} searchData={searchResults} />
            </div>
            <AddNewRowSidebar endpoint={props.endpoint} />
        </div>
    );
};

export default DataHandler;
