import React from 'react';
import './ComingSoon.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHardHat } from '@fortawesome/free-solid-svg-icons';

interface ComingSoonProps {
    feature: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ feature }) => {
    return (
        <div className="coming-soon-section">
            <div className="coming-soon-icon">
                <FontAwesomeIcon icon={faHardHat} />
            </div>
            <h2>{feature}</h2>
            <p>Esta función está en desarrollo y estará disponible próximamente.</p>
            <p>¡Vuelve pronto para descubrir las nuevas funcionalidades!</p>
        </div>
    );
};

export default ComingSoon; 