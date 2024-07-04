import React from "react";
import "./index.css";

const ProfileInfo = () => {
    return (
      <div className="profile-info">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjDM0PhKJ_GdWFpZd6zUh3lENRBqkScnZ4Cg&s" alt="Player Profile" className="profile-pic" />
        <div className="profile-details">
          <h1 className="profile-name">Nicolas Fernandez</h1>
          <p className="profile-role">Jugador</p>
          <p className="profile-club">Sin Club</p>
          <p className="profile-location">Buenos Aires, Argentina</p>
          <p className="profile-followers"><span>200 followers</span></p>
        </div>
        <button className="edit-button">Editar</button>
      </div>
    );
  }
  
  export default ProfileInfo;