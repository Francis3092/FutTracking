import React from "react";
import Header from "./Components/Header";
import ProfileInfo from "./Components/ProfileInfo";
import Tabs from "./Components/Tabs";
import Gallery from "./Components/Gallery";
import Footer from "./Components/Footer";
import './index.css';

function Profile() {
    return (
        <div className="container">
          <Header />
          <ProfileInfo />
          <Tabs />
          <main className="profile-main">
            <Gallery />
          </main>
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      );
}

export default Profile;