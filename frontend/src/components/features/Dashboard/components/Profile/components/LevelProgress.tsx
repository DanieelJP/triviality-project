import React from 'react';
import { useIntl } from 'react-intl';
import './LevelProgress.css';

interface LevelProgressProps {
    progress: {
        current_level: number;
        current_xp: number;
        next_level_xp: number;
        progress_percentage: number;
    };
}

const LevelProgress: React.FC<LevelProgressProps> = ({ progress }) => {
    const intl = useIntl();

    return (
        <div className="level-progress">
            <div className="level-info">
                <span className="level-number">
                    {intl.formatMessage(
                        { id: 'profile.level', defaultMessage: 'Nivel {level}' },
                        { level: progress.current_level }
                    )}
                </span>
                <span className="xp-info">
                    {progress.current_xp} / {progress.next_level_xp} XP
                </span>
            </div>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progress.progress_percentage}%` }}
                />
            </div>
        </div>
    );
};

export default LevelProgress; 