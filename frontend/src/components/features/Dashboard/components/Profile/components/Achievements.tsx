import React from 'react';
import { useIntl } from 'react-intl';
import './Achievements.css';

interface AchievementsProps {
    achievements: Array<{
        id: number;
        name: string;
        description: string;
        unlocked_at: string;
    }>;
}

const Achievements: React.FC<AchievementsProps> = () => {
    const intl = useIntl();

    return (
        <div className="achievements-container">
            <div className="coming-soon-message">
                <h3>{intl.formatMessage({ 
                    id: 'comingSoon.development', 
                    defaultMessage: 'Esta función está en desarrollo y estará disponible próximamente.' 
                })}</h3>
                <p>{intl.formatMessage({ 
                    id: 'comingSoon.checkBack', 
                    defaultMessage: '¡Vuelve pronto para descubrir las nuevas funcionalidades!' 
                })}</p>
            </div>
        </div>
    );
};

export default Achievements; 