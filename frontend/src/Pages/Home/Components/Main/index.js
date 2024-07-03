import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { FaPlay, FaHeart, FaComment, FaEye, FaShareAlt, FaGripLinesVertical, FaWhatsapp, FaFacebook, FaTwitter, FaInstagram, FaDownload } from "react-icons/fa";

const Main = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const videoRef = useRef();
    const shareMenuRef = useRef();

    useEffect(() => {
        videoRef.current.play();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };

        if (showShareMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showShareMenu]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        if (!isPlaying) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }
    };

    const handleScreenClick = () => {
        handlePlayPause();
        setShowPlayButton(prev => !prev);
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        setShowShareMenu(!showShareMenu);
    }

    return (
        <div className="image-container" onClick={handleScreenClick}>
            <video ref={videoRef} src='/vids/1.mp4' className='player-img' autoPlay loop controls={false}></video>
            {showPlayButton && (
                <button className="play-button" onClick={handlePlayPause}>
                    {!isPlaying ? <FaPlay className='play-icon' /> : <FaGripLinesVertical className='play-icon' />}
                </button>
            )}
            <div className="overlay"></div>
            <div className="player-info">
                <div className="user-info">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="Player Profile" className="user-profile-img" />
                    <div className="user-details">
                        <p className="user-name">Ruben Botta</p>
                        <p className="user-location">CABA, Buenos Aires, Argentina</p>
                    </div>
                    <button className="follow-button">Siguiendo</button>
                </div>
                <div className="stats">
                    <div className="stat">
                        <FaHeart className='stat-icon' />
                        <span>4445</span>
                    </div>
                    <div className="stat">
                        <FaComment className='stat-icon' />
                        <span>578</span>
                    </div>
                    <div className="stat">
                        <FaEye className='stat-icon' />
                        <span>61.3K</span>
                    </div>
                    <div className="stat" onClick={handleShareClick}>
                        <FaShareAlt className='stat-icon' />
                        <span>Share</span>
                    </div>
                </div>
            </div>
            {showShareMenu && (
                <div className="share-menu" ref={shareMenuRef} onClick={(e) => e.stopPropagation()}>
                    <div className="share-icons">
                        <a href={`whatsapp://send?text=Check this out: ${window.location.href}`}><FaWhatsapp className='share-icon whatsapp' /></a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target="_blank" rel="noopener noreferrer"><FaFacebook className='share-icon facebook' /></a>
                        <a href={`https://twitter.com/intent/tweet?url=${window.location.href}&text=Check this out`} target="_blank" rel="noopener noreferrer"><FaTwitter className='share-icon twitter' /></a>
                        <a href={`https://www.instagram.com/?url=${window.location.href}`} target="_blank" rel="noopener noreferrer"><FaInstagram className='share-icon instagram' /></a>
                        <a href='/vids/1.mp4' download><FaDownload className='share-icon download' /></a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Main;
