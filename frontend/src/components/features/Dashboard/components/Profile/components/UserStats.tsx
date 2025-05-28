import React from 'react';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faGamepad, 
    faStar, 
    faBullseye, 
    faClock 
} from '@fortawesome/free-solid-svg-icons';
import StatsCharts from './StatsCharts';
import './UserStats.css';

interface UserStatsProps {
    stats: {
        total_games: number;
        total_points: number;
        accuracy: number;
        avg_response_time: number;
    };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
    const intl = useIntl();

    return (
        <div className="user-stats">
            <div className="stats-grid">
                <div className="stat-card">
                    <FontAwesomeIcon icon={faGamepad} className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-value">{stats.total_games}</div>
                        <div className="stat-label">
                            {intl.formatMessage({ id: 'stats.totalGames', defaultMessage: 'Partidas Totales' })}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <FontAwesomeIcon icon={faStar} className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-value">{stats.total_points}</div>
                        <div className="stat-label">
                            {intl.formatMessage({ id: 'stats.totalPoints', defaultMessage: 'Puntos Totales' })}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <FontAwesomeIcon icon={faBullseye} className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-value">{stats.accuracy}%</div>
                        <div className="stat-label">
                            {intl.formatMessage({ id: 'stats.accuracy', defaultMessage: 'Precisión' })}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <FontAwesomeIcon icon={faClock} className="stat-icon" />
                    <div className="stat-info">
                        <div className="stat-value">{stats.avg_response_time.toFixed(1)}s</div>
                        <div className="stat-label">
                            {intl.formatMessage({ id: 'stats.avgResponseTime', defaultMessage: 'Tiempo Promedio' })}
                        </div>
                    </div>
                </div>
            </div>
            <StatsCharts stats={stats} />
        </div>
    );
};

export default UserStats; 