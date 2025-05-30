import React from 'react';
import { useIntl } from 'react-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import './Achievements.css';

interface AchievementsProps {
    achievements: Array<{
        id: number;
        name: string;
        description: string;
        unlocked_at: string;
    }>;
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
    const intl = useIntl();

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return intl.formatDate(date, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!achievements || achievements.length === 0) {
        return (
            <div className="achievements">
                <h3>
                    {intl.formatMessage({ 
                        id: 'profile.achievements.title', 
                        defaultMessage: 'Logros' 
                    })}
                </h3>
                <p className="no-achievements">
                    {intl.formatMessage({ 
                        id: 'profile.achievements.empty', 
                        defaultMessage: 'Aún no has desbloqueado ningún logro' 
                    })}
                </p>
            </div>
        );
    }

    return (
        <div className="achievements">
            <h3>
                {intl.formatMessage({ 
                    id: 'profile.achievements.title', 
                    defaultMessage: 'Logros Desbloqueados' 
                })}
            </h3>
            <div className="achievements-grid">
                {achievements.map((achievement) => (
                    <div key={achievement.id} className="achievement-card">
                        <div className="achievement-icon">
                            <FontAwesomeIcon icon={faTrophy} className="icon" />
                        </div>
                        <div className="achievement-info">
                            <h4>{achievement.name}</h4>
                            <p>{achievement.description}</p>
                            <span className="unlock-date">
                                {intl.formatMessage(
                                    { 
                                        id: 'profile.achievements.unlockedOn', 
                                        defaultMessage: 'Desbloqueado el {date}' 
                                    },
                                    { date: formatDate(achievement.unlocked_at) }
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements; 