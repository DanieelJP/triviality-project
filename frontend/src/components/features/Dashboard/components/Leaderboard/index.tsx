import React from 'react';
import { useIntl } from 'react-intl';
import './Leaderboard.css';
import ComingSoon from '../ComingSoon';

const Leaderboard: React.FC = () => {
    const intl = useIntl();
    const leaderboardTitle = intl.formatMessage({ id: "nav.leaderboard", defaultMessage: "Clasificación" });
    
    return (
        <div className="leaderboard-container">
            <div className="dashboard-content-wrapper">
                <ComingSoon feature={leaderboardTitle} />
            </div>
        </div>
    );
};

export default Leaderboard; 