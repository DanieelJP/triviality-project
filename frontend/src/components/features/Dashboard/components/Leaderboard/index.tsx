import React from 'react';
import './Leaderboard.css';
import ComingSoon from '../ComingSoon';

const Leaderboard: React.FC = () => {
    return (
        <div className="leaderboard-container">
            <div className="dashboard-content-wrapper">
                <ComingSoon feature="Clasificación" />
            </div>
        </div>
    );
};

export default Leaderboard; 