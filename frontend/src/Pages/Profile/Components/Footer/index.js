import React from "react";
import "./index.css";
import { FaHome, FaComments, FaCamera, FaEnvelope, FaUser } from "react-icons/fa";

const Footer = () => {
    return (
        <div class="footer-icons">
            <div class="footer-icon">
                <FaHome className="footer-icon-icon"/>
                <span>Inicio</span>
            </div>
            <div class="footer-icon">
                <FaComments className="footer-icon-icon"/>
                <span>Mensajes</span>
            </div>
            <div class="footer-icon">
                <FaCamera className="footer-icon-icon"/>
                <span>Cámara</span>
            </div>
            <div class="footer-icon">
                <FaEnvelope className="footer-icon-icon"/>
                <span>Community</span>
            </div>
            <div class="footer-icon">
                <FaUser className="footer-icon-icon"/>
                <span>Perfil</span>
            </div>
        </div>
    );
};

export default Footer;