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
                <span className="level-text">
                    {intl.formatMessage(
                        { id: 'profile.level', defaultMessage: 'Level {level}' },
                        { level: progress.current_level }
                    )}
                </span>
                <span className="xp-text">
                    {intl.formatMessage(
                        { 
                            id: 'profile.xpProgress', 
                            defaultMessage: '{current} / {total} XP' 
                        },
                        { 
                            current: progress.current_xp,
                            total: progress.next_level_xp
                        }
                    )}
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