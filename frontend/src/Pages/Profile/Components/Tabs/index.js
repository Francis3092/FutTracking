import React, { useState } from "react";
import './index.css';

const Tabs = ({ onTabChange }) => {
    const [activeTab, setActiveTab] = useState('Videos');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <div className="tabs">
            <button 
                className={`tab ${activeTab === 'Videos' ? 'active' : ''}`}
                onClick={() => handleTabClick('Videos')}
            >
                Videos
            </button>
            <button 
                className={`tab ${activeTab === 'Posteos' ? 'active' : ''}`}
                onClick={() => handleTabClick('Posteos')}
            >
                Posteos
            </button>
            <button 
                className={`tab ${activeTab === 'MisDatos' ? 'active' : ''}`}
                onClick={() => handleTabClick('MisDatos')}
            >
                Mis Datos
            </button>
        </div>
    );
}

export default Tabs;