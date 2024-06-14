// src/Components/Home.js
import React from 'react';
import Header from '../Header';
import Main from '../Main';
import Footer from '../Footer';
import './index.css';


function Home() {
    return (
        <div className="container">
          <Header />
          <main className="main-content">
            <Main />
          </main>
          <footer className="footer">
            <Footer />
          </footer>
        </div>
      );
}

export default Home;
