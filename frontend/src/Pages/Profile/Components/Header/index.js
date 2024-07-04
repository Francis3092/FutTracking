import React from 'react';
import './index.css';
import logo from './Images/logo.png';
import { FaChevronLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="profile-header">
          <button className="back-button">
            <Link to="/home"><FaChevronLeft /></Link>
          </button>
          <img src={logo} alt="Logo" className="logo" />
        </header>
      );
};

export default Header;