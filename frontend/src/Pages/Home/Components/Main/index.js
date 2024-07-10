import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { FaPlay, FaPause, FaHeart, FaComment, FaEye, FaShareAlt, FaDownload, FaLink } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { getVideoData, getVideoLikes, getVideoComments } from '../../../../Configs/supabaseClient';

const Main = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showCommentMenu, setShowCommentMenu] = useState(false);
    const [videoData, setVideoData] = useState(null);
    const [likes, setLikes] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [lastClickTime, setLastClickTime] = useState(0);
    const [liked, setLiked] = useState(false);

    const videoRef = useRef();
    const shareMenuRef = useRef();
    const commentMenuRef = useRef();
    const progressBarRef = useRef();

    useEffect(() => {
        const fetchVideoData = async () => {
            const video = await getVideoData();
            if (video) {
                setVideoData(video);
                const videoLikes = await getVideoLikes(video.id);
                setLikes(videoLikes);
                const videoComments = await getVideoComments(video.id);
                setComments(videoComments);
            } else {
                console.error("No se pudo obtener los datos del video.");
            }
        };

        fetchVideoData();
    }, []);

    useEffect(() => {
        if (videoData && videoRef.current) {
            const playVideo = async () => {
                try {
                    await videoRef.current.play();
                    setIsPlaying(true);
                } catch (e) {
                    console.error("Error al reproducir:", e);
                    setIsPlaying(false);
                }
            };
            playVideo();
        }
    }, [videoData]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
            if (commentMenuRef.current && !commentMenuRef.current.contains(event.target)) {
                setShowCommentMenu(false);
            }
        };

        if (showShareMenu || showCommentMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showShareMenu, showCommentMenu]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(e => console.error("Error al reproducir:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleScreenClick = (e) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastClickTime < 300) {
            handleDoubleClick(e);
        } else {
            handlePlayPause();
        }
        setLastClickTime(currentTime);
    };

    const handleDoubleClick = (e) => {
        const newTime = videoRef.current.currentTime + 10;
        videoRef.current.currentTime = newTime < videoRef.current.duration ? newTime : videoRef.current.duration;
    };

    const handleShareClick = (e) => {
        e.stopPropagation();
        setShowShareMenu(!showShareMenu);
    };

    const handleCommentClick = (e) => {
        e.stopPropagation();
        setShowCommentMenu(!showCommentMenu);
    };

    const handleLikeClick = () => {
        setLiked(!liked);
    };

    const handleCloseShareMenu = () => {
        setShowShareMenu(false);
    };

    const handleCloseCommentMenu = () => {
        setShowCommentMenu(false);
    };

    const handleDownload = () => {
        if (videoData && videoData.url) {
            const link = document.createElement('a');
            link.href = videoData.url;
            link.setAttribute('download', 'video.mp4');
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
        setDuration(videoRef.current.duration);
    };

    const handleProgressClick = (e) => {
        const newTime = (e.nativeEvent.offsetX / progressBarRef.current.offsetWidth) * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleProgressClick(e);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            handleProgressClick(e);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handlePostComment = () => {
        if (newComment.trim()) {
            setComments([...comments, { user: 'Tú', text: newComment, replies: [] }]);
            setNewComment("");
        }
    };

    const handleReplyClick = (index) => {
        const replyText = prompt('Escribí tu respuesta:');
        if (replyText && replyText.trim()) {
            const updatedComments = [...comments];
            updatedComments[index].replies.push({ user: 'Tú', text: replyText });
            setComments(updatedComments);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className="image-container">
            <video 
                ref={videoRef}
                src={videoData ? videoData.url : ''}
                className="player-img"
                playsInline
                loop
                onClick={handleScreenClick}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={() => videoRef.current.play().catch(e => console.error("Error al cargar metadata:", e))}
            />
            <div className="player-info">
                <div className="controls-wrapper">
                    <button className="pause-button" onClick={handlePlayPause}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                    <div className="time-bar"
                        ref={progressBarRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}>
                        <span className="time">{formatTime(currentTime)}</span>
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
                        </div>
                        <span className="time">{formatTime(duration - currentTime)}</span>
                    </div>
                </div>
                <div className="user-info">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="Player Profile" className="user-profile-img" />
                    <div className="user-details">
                        <p className="user-name">Ruben Botta</p>
                        <p className="user-location">CABA, Buenos Aires, Argentina</p>
                    </div>
                    <button className="follow-button">Siguiendo</button>
                </div>
                <div className="stats">
                    <div className="stat" onClick={handleLikeClick} style={{ cursor: 'pointer' }}>
                        <FaHeart className={`stat-icon ${liked ? 'liked' : ''}`} />
                        <span>{liked ? likes.length + 1 : likes.length}</span>
                    </div>
                    <div className="stat" onClick={handleCommentClick} style={{ cursor: 'pointer' }}>
                        <FaComment className='stat-icon' />
                        <span>{comments.length}</span>
                    </div>
                    <div className="stat">
                        <FaEye className='stat-icon' />
                        <span>61.3K</span>
                    </div>
                    <div className="stat" onClick={handleShareClick} style={{ cursor: 'pointer' }}>
                        <FaShareAlt className='stat-icon' />
                        <span>Compartir</span>
                    </div>
                </div>
            </div>
            {showShareMenu && (
                <div className="share-menu" ref={shareMenuRef} onClick={(e) => e.stopPropagation()}>
                    <p className="share-title">Compartir video</p>
                    <div className="share-subtitle-container">
                        <FaRegEnvelope className='envelope'/>
                        <p className="share-subtitle">Enviar vía Mensaje Directo</p>
                    </div>
                    <div className="share-icons">
                        <div className="share-icon-container">
                            <img src="https://cdn-icons-png.freepik.com/256/3983/3983877.png?semt=ais_hybrid" alt="WhatsApp" className="share-img" />
                            <span>WhatsApp</span>
                        </div>
                        <div className="share-icon-container">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png" alt="Telegram" className="share-img" />
                            <span>Telegram</span>
                        </div>
                        <div className="share-icon-container">
                            <img src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png" alt="LinkedIn" className="share-img" />
                            <span>LinkedIn</span>
                        </div>
                        <div className="share-icon-container">
                            <img src="https://static-00.iconduck.com/assets.00/gmail-icon-1024x1024-09wrt8am.png" alt="Gmail" className="share-img" />
                            <span>Gmail</span>
                        </div>
                    </div>
                    <div className="share-icons">
                        <div className="share-icon-container">
                            <div className="share-icon">
                                <FaLink />
                            </div>
                            <span>Copiar enlace</span>
                        </div>
                        <div className="share-icon-container" onClick={handleDownload}>
                            <div className="share-icon">
                                <FaDownload />
                            </div>
                            <span>Guardar</span>
                        </div>
                    </div>
                    <button className="cancel-button" onClick={handleCloseShareMenu}>Cancelar</button>
                </div>
            )}
            {showCommentMenu && (
                <div className="comment-menu" ref={commentMenuRef} onClick={(e) => e.stopPropagation()}>
                    <p className="comment-title">Comentarios</p>
                    <div className="comment-section">
                        {comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <div className="comment-user-info">
                                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="User Profile" className="comment-user-profile-img" />
                                    <div className="comment-user-details">
                                        <p className="comment-user-name">{comment.user}</p>
                                    </div>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                                <button className="reply-button" onClick={() => handleReplyClick(index)}>Responder</button>
                                {comment.replies && comment.replies.map((reply, replyIndex) => (
                                    <div key={replyIndex} className="comment reply">
                                        <div className="comment-user-info">
                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="User Profile" className="comment-user-profile-img" />
                                            <div className="comment-user-details">
                                                <p className="comment-user-name">{reply.user}</p>
                                            </div>
                                        </div>
                                        <p className="comment-text">{reply.text}</p>
                                    </div>
                                ))}
                                <hr className="comment-divider" />
                            </div>
                        ))}
                    </div>
                    <div className="comment-input-wrapper">
                        <input 
                            type="text" 
                            className="comment-input" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder="Escribí tu respuesta"
                        />
                        <button className="comment-send-button" onClick={handlePostComment}>Enviar</button>
                    </div>
                    <button className="cancel-button" onClick={handleCloseCommentMenu}>Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default Main;
