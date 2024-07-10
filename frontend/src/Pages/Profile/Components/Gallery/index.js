import React, { useEffect, useState } from "react";
import supabase from "../../../../Configs/supabaseClient"; // Asegúrate de tener esta configuración
import "./index.css";

const Gallery = () => {
    const [videos, setVideos] = useState([]);

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

    return (
        <div className="gallery">
            {videos.map(video => (
                <div className="gallery-item" key={video.id}>
                    <iframe
                        src={video.url}
                        className="gallery-img"
                        title={video.titulo}
                        allowFullScreen
                    ></iframe>
                </div>
            ))}
        </div>
    );
}

export default Gallery;
