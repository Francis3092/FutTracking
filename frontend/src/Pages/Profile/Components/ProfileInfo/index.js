import React, { useEffect, useState } from "react";
import supabase from "../../../../Configs/supabaseClient"; // Asegúrate de tener esta configuración
import "./index.css";

const ProfileInfo = () => {
    const [profile, setProfile] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', 11)
                .single();
            if (error) {
                console.error("Error fetching profile:", error);
            } else {
                setProfile(data);
            }
        };
        fetchProfile();
    }, []);

    if (!profile.nombre) {
        return <div>Loading...</div>;
    }

    return (
        <div className="profile-info">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="Player Profile" className="profile-pic" />
            <div className="profile-details">
                <h1 className="profile-name">{profile.nombre} {profile.apellido}</h1>
                <p className="profile-role">{profile.rol}</p>
                  <p className="profile-location">Buenos Aires, Argentina</p>
                <p className="profile-followers"><span>200 followers</span></p>
            </div>
            <button className="edit-button">Editar</button>
        </div>
    );
}

export default ProfileInfo;
