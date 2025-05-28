import React from 'react';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCircle as easyIcon,
    faSquare as mediumIcon,
    faStar as hardIcon
} from '@fortawesome/free-solid-svg-icons';
import './DifficultyStats.css';

interface DifficultyStatsProps {
    stats: Array<{
        question_difficulty: string;
        total_questions: number;
        correct_answers: number;
        accuracy_percentage: number;
    }>;
}

const DifficultyStats: React.FC<DifficultyStatsProps> = ({ stats }) => {
    const intl = useIntl();

    const difficultyIcons = {
        easy: easyIcon,
        medium: mediumIcon,
        hard: hardIcon
    };

    const difficultyColors = {
        easy: '#4CAF50',
        medium: '#FF9800',
        hard: '#F44336'
    };

    const getDifficultyLabel = (difficulty: string) => {
        const labels = {
            easy: intl.formatMessage({ id: 'difficulty.easy', defaultMessage: 'Fácil' }),
            medium: intl.formatMessage({ id: 'difficulty.medium', defaultMessage: 'Media' }),
            hard: intl.formatMessage({ id: 'difficulty.hard', defaultMessage: 'Difícil' })
        };
        return labels[difficulty as keyof typeof labels] || difficulty;
    };

    return (
        <div className="difficulty-stats">
            <h3>
                {intl.formatMessage({ 
                    id: 'profile.stats.difficultyTitle', 
                    defaultMessage: 'Rendimiento por Dificultad' 
                })}
            </h3>
            <div className="difficulty-grid">
                {stats.map((difficulty, index) => (
                    <div key={index} className="difficulty-card">
                        <div className="difficulty-header">
                            <FontAwesomeIcon 
                                icon={difficultyIcons[difficulty.question_difficulty as keyof typeof difficultyIcons]} 
                                style={{ color: difficultyColors[difficulty.question_difficulty as keyof typeof difficultyColors] }}
                            />
                            <h4>{getDifficultyLabel(difficulty.question_difficulty)}</h4>
                        </div>
                        <div className="difficulty-stats-content">
                            <div className="accuracy-circle">
                                <svg viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#eee"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={difficultyColors[difficulty.question_difficulty as keyof typeof difficultyColors]}
                                        strokeWidth="3"
                                        strokeDasharray={`${difficulty.accuracy_percentage}, 100`}
                                    />
                                    <text x="18" y="20.35" className="percentage">
                                        {difficulty.accuracy_percentage.toFixed(0)}%
                                    </text>
                                </svg>
                            </div>
                            <div className="difficulty-details">
                                <span>
                                    {intl.formatMessage(
                                        { 
                                            id: 'profile.stats.correctOf', 
                                            defaultMessage: '{correct} de {total} correctas'
                                        },
                                        {
                                            correct: difficulty.correct_answers,
                                            total: difficulty.total_questions
                                        }
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DifficultyStats; 