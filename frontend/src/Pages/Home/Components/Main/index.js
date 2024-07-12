import React, { useState, useRef, useEffect } from 'react';
import './index.css';
import { FaPlay, FaPause, FaHeart, FaComment, FaEye, FaShareAlt, FaDownload, FaLink, FaChevronDown } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import supabase,{ getVideoData, getVideoLikes, getVideoComments } from '../../../../Configs/supabaseClient';

const Main = () => {
    const [videos, setVideos] = useState([]);
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
    const [replyTo, setReplyTo] = useState(null);
    const [liked3, setLiked3] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const videoRef = useRef();
    const shareMenuRef = useRef();
    const commentMenuRef = useRef();
    const progressBarRef = useRef();

    useEffect(() => {
        const fetchVideoData = async () => {
            const video = await getVideoData();
            if (video) {
                setVideoData(video);
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

    const handleCommentClick = async (e) => {
        e.stopPropagation();
        setShowCommentMenu(!showCommentMenu);
        
        try {
            // Si necesitas obtener comentarios aquí, descomenta y ajusta según tus necesidades
             const { data, error } = await supabase
                 .from('comentarios')
                 .select('id,contenido,fechacomentario,usuarioid')
                 .eq('videoid', 1);
                 console.log("data",data)
    
             if (error) {
                 throw error;
             }
             let prevComments={ user: null, text:null, replies: [] };
             console.log(prevComments)
             for (let i=0 ; i < data.length; i++) {
                const newComment = { user: data[i].id, text: data[i].contenido, replies: [] };
                
                if (newComment!==prevComments)
                {
                    setComments(prevComments => [...prevComments, newComment]);
                    console.log(prevComments)

                }
                if(newComment===prevComments)
             {
                console.log(prevComments)
                setComments(null);
             }   
            }
          
        
    } catch (error) {
        console.error('Error fetching comments:', error.message);
    }
};

const handleLikeClick = async () => {
        
    const updatedLikes = liked3 ? likes - 1 : likes + 1;

     const { data, error } = await supabase
         .from('videos')
         .update({ likes: updatedLikes })
         .eq('id', 1);   
        console.log(data)
    // if (error) {
    //     console.error("Error updating likes:", error);
    // } else {
        console.log(updatedLikes);
        setLikes(updatedLikes);
         setLiked3(!liked3);
    // }
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

    // const handlePostComment = () => {
    //     if (newComment.trim()) {
    //         if (replyTo !== null) {
    //             const updatedComments = [...comments];
    //             updatedComments[replyTo].replies.push({ user: 'Tú', text: newComment, timestamp: new Date(), likes: 0 });
    //             setComments(updatedComments);
    //             setReplyTo(null);
    //         } else {
    //             setComments([...comments, { user: 'Tú', text: newComment, replies: [], timestamp: new Date(), likes: 0 }]);
    //         }
    //         setNewComment("");
    //     }
    // };
    const handlePostComment = async () => {
        if (newComment.trim()) {
            const { data, error } = await supabase
                .from('comentarios')
                .insert({
                    videoid: 1,
                    contenido: newComment,
                    fechacomentario: new Date().toISOString(),
                    usuarioid: 11
                });

            if (error) {
                console.error("Error posting comment:", error);
            } else {
                setComments([...comments, { user: 'Tú', text: newComment, replies: [] }]);
                setNewComment("");
            }
        }
    };

    const handleReplyClick = (index) => {
        setReplyTo(index);
    };

    const toggleReplies = (index) => {
        const updatedComments = [...comments];
        updatedComments[index].showReplies = !updatedComments[index].showReplies;
        setComments(updatedComments);
    };

    const handleCommentLike = (commentIndex, replyIndex) => {
        const updatedComments = [...comments];
        if (replyIndex !== undefined) {
            const reply = updatedComments[commentIndex].replies[replyIndex];
            reply.liked = !reply.liked;
            reply.likes += reply.liked ? 1 : -1;
        } else {
            const comment = updatedComments[commentIndex];
            comment.liked = !comment.liked;
            comment.likes += comment.liked ? 1 : -1;
        }
        setComments(updatedComments);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(timestamp)) / 1000);
        if (diff < 60) return `${diff} s`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
        return `${Math.floor(diff / 86400)} d`;
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
                        <FaHeart className={`stat-icon ${liked3 ? 'liked' : ''}`} />
                        <span>{liked3.length ? likes.length + 1 : likes.length}</span>
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
                                        <p className="comment-timestamp">{formatTimestamp(comment.timestamp)}</p>
                                    </div>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                                <div className="comment-stats">
                                    <button className="reply-button" onClick={() => handleReplyClick(index)}>Responder</button>
                                    <div className="comment-like-icon" onClick={() => handleCommentLike(index)}>
                                        <FaHeart className={comment.liked ? 'liked' : ''} />
                                        <span>{comment.likes}</span>
                                    </div>
                                </div>
                                {comment.replies && comment.replies.length > 0 && (
                                    <>
                                        <button className="view-replies-button" onClick={() => toggleReplies(index)}>
                                            {comment.showReplies ? 'Ocultar respuestas' : `Ver ${comment.replies.length} respuestas`} <FaChevronDown />
                                        </button>
                                        {comment.showReplies && (
                                            <div className="replies">
                                                {comment.replies.map((reply, replyIndex) => (
                                                    <div key={replyIndex} className="comment reply">
                                                        <div className="comment-user-info">
                                                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="User Profile" className="comment-user-profile-img" />
                                                            <div className="comment-user-details">
                                                                <p className="comment-user-name">{reply.user}</p>
                                                                <p className="comment-timestamp">{formatTimestamp(reply.timestamp)}</p>
                                                            </div>
                                                        </div>
                                                        <p className="comment-text">{reply.text}</p>
                                                        <div className="comment-stats">
                                                            <button className="reply-button" onClick={() => handleReplyClick(index)}>Responder</button>
                                                            <div className="comment-like-icon" onClick={() => handleCommentLike(index, replyIndex)}>
                                                                <FaHeart className={reply.liked ? 'liked' : ''} />
                                                                <span>{reply.likes}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="comment-input-wrapper">
                        <input 
                            type="text" 
                            className="comment-input" 
                            value={newComment} 
                            onChange={(e) => setNewComment(e.target.value)} 
                            placeholder={replyTo !== null ? "Responde al comentario..." : "Escribí tu respuesta"}
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
