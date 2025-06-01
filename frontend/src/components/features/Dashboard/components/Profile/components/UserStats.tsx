import React from 'react';
import { useIntl } from 'react-intl';
import StatsCharts from './StatsCharts';
import CategoryStats from './CategoryStats';
import DifficultyStats from './DifficultyStats';
import './UserStats.css';

interface CategoryStat {
    category: string;
    total_questions: number;
    correct_answers: number;
    accuracy_percentage: number;
}

interface DifficultyStat {
    question_difficulty: string;
    total_questions: number;
    correct_answers: number;
    accuracy_percentage: number;
}

interface UserStatsProps {
    stats: {
        total_games: number;
        total_points: number;
        accuracy: number;
        avg_response_time: number;
        category_stats?: CategoryStat[];
        difficulty_stats?: DifficultyStat[];
    };
}

const UserStats: React.FC<UserStatsProps> = ({ stats }) => {
    const intl = useIntl();

    return (
        <div className="user-stats">
            <div className="stats-overview">
                <h3>{intl.formatMessage({ id: 'profile.stats.generalMetrics', defaultMessage: 'Métricas Generales' })}</h3>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h4>{intl.formatMessage({ id: 'profile.stats.totalGames', defaultMessage: 'Total de Juegos' })}</h4>
                        <p>{stats.total_games}</p>
                    </div>
                    <div className="stat-card">
                        <h4>{intl.formatMessage({ id: 'profile.stats.totalPoints', defaultMessage: 'Total de Puntos' })}</h4>
                        <p>{stats.total_points} {intl.formatMessage({ id: 'profile.stats.points', defaultMessage: 'puntos' })}</p>
                    </div>
                    <div className="stat-card">
                        <h4>{intl.formatMessage({ id: 'profile.stats.accuracy', defaultMessage: 'Precisión' })}</h4>
                        <p>{stats.accuracy}%</p>
                    </div>
                    <div className="stat-card">
                        <h4>{intl.formatMessage({ id: 'profile.stats.avgResponseTime', defaultMessage: 'Tiempo Promedio de Respuesta' })}</h4>
                        <p>{stats.avg_response_time}s</p>
                    </div>
                </div>
            </div>

            <StatsCharts stats={stats} />
            {stats.category_stats && <CategoryStats stats={stats.category_stats} />}
            {stats.difficulty_stats && <DifficultyStats stats={stats.difficulty_stats} />}
        </div>
    );
};

export default UserStats; 