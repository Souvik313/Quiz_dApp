import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/body.css';
import infoIcon from '../assets/info-icon.png';
import getStartedIcon from '../assets/get-started-icon.png';
export const Body = (props) => {
    const navigate = useNavigate();
    return (
        <main>
            <div className="body-container transparent-bg">
                <h1>Welcome to Quizathon</h1>
                <p>Your one-stop solution for all quiz-related needs!</p>
                <p>
                    This is not just another quiz app; it's a community-driven platform where you can create, share, and participate in quizzes on various topics,
                    all while earning exciting rewards.
                    <br />Join our community today and start your quiz journey!
                </p>
                <div className="button-group">
                    <button className="learn-more-btn" onClick={() => navigate("/about")}>
                        <span>Learn More</span>
                        <img src={infoIcon} alt="info" className='info-icon'/>
                    </button>
                    {!props.isLoggedIn ? (<button className="get-started-btn" onClick={() => navigate("/login")}>
                        <span>Get Started</span>
                        <img src={getStartedIcon} alt="get started" className='get-started-icon'/>
                    </button>):
                    (
                        <button className="get-started-btn" onClick={() => navigate("/get-started")}>
                        <span>Get Started</span>
                        <img src={getStartedIcon} alt="get started" className='get-started-icon'/>
                    </button>
                    )}
                </div>
            </div>
        </main>
    )
}
    
    
