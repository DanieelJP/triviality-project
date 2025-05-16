import React from 'react';
import './Profile.css';
import ComingSoon from '../ComingSoon';

const Profile: React.FC = () => {
    return (
        <div className="profile-container">
            <div className="dashboard-content-wrapper">
                <ComingSoon feature="Perfil de Usuario" />
            </div>
        </div>
    );
};

export default Profile; 