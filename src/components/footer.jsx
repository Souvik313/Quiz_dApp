import React from 'react';
import './styles/footer.css';

export const Footer = () => (
    <footer className="footer transparent-bg">
        <p>
            &copy; {new Date().getFullYear()} Quizathon &mdash; Empowering Minds, One Quiz at a Time.<br />
            <span>
                Made with <span style={{color: "#ffd700"}}>★</span> by the Quizathon Team
            </span>
        </p>
        <p>
            <a href="https://github.com/Souvik313" target="_blank" rel="noopener noreferrer">GitHub</a> | 
            <a href="/privacy" style={{marginLeft: "8px"}}>Privacy Policy</a> | 
            <a href="/contact" style={{marginLeft: "8px"}}>Contact Us</a>
        </p>
    </footer>
);