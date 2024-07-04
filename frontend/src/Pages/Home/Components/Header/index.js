import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSlidersH, FaCog } from "react-icons/fa";

const Header = () => {
    return (
        <header className="header">
            <Link to="/profile"><FaUserCircle className="profile-img"/></Link>
            <div className="search-container">
                <input type="text" placeholder="Buscar..." className="search-bar" />
                <FaSearch className="search-icon" />
            </div>
            <div className="icons">
                <FaSlidersH className="icon" />
                <FaCog className="icon" />
            </div>
        </header>
    );
};

export default Header;