import React from 'react';
import { useIntl } from 'react-intl';
import './Profile.css';
import ComingSoon from '../ComingSoon';

const Profile: React.FC = () => {
    const intl = useIntl();
    const profileTitle = intl.formatMessage({ id: "profile.title", defaultMessage: "Perfil de Usuario" });
    
    return (
        <div className="profile-container">
            <div className="dashboard-content-wrapper">
                <ComingSoon feature={profileTitle} />
            </div>
        </div>
    );
};

export default Profile; 