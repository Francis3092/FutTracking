import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import supabase from "../../../../Configs/supabaseClient"; // Asegúrate de tener esta configuración
import "./index.css";
import UserInfo from "./Components/UserInfo";

const Gallery = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .eq('usuarioid', 11);
            if (error) {
                console.error("Error fetching videos:", error);
            } else {
                setVideos(data);
            }
        };
        fetchVideos();
    }, []);

    const handleVideoClick = (video) => {
        setSelectedVideo(video);
    };

    const handleCloseVideo = () => {
        setSelectedVideo(null);
    };

    return (
        <div className="gallery">
            {videos.map(video => (
                <div className="gallery-item" key={video.id}>
                    <video
                        src={video.url}
                        className="gallery-img"
                        onClick={() => handleVideoClick(video)}
                        controls={false}
                    ></video>
                </div>
            ))}
            {selectedVideo && (
                <div className="fullscreen-video">
                    <video src={selectedVideo.url} className="fullscreen-video-player" autoPlay controlsList="nodownload nofullscreen"></video>
                    <button className="close-button" onClick={handleCloseVideo}>
                        <FaArrowLeft size={24} />
                    </button>
                    <UserInfo video={selectedVideo} />
                </div>
                
            )}
        </div>
    );
};

export default Gallery;
