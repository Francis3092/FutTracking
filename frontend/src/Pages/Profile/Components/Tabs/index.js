import React from "react";
import './index.css';

const Tabs = () => {
    return (
        <div className="tabs">
            <button className="tab active">Videos</button>
            <button className="tab">Posteos</button>
            <button className="tab">Mis Datos</button>
        </div>
    );
}

export default Tabs;