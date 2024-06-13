import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { FaPlay, FaHeart, FaComment, FaEye, FaShareAlt, FaGripLinesVertical } from "react-icons/fa";

const Main = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const videoRef = useRef();

    useEffect(() => {
        videoRef.current.play();
    }, []);

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
                    <div className="stat">
                        <FaShareAlt className='stat-icon' />
                        <span>Share</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
