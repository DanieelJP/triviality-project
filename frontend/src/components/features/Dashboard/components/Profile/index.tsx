import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import './Profile.css';
import axios from '../../../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTrophy, faChartLine, faMedal } from '@fortawesome/free-solid-svg-icons';
import UserStats from './components/UserStats';
import Achievements from './components/Achievements';
import CategoryStats from './components/CategoryStats';
import DifficultyStats from './components/DifficultyStats';
import LevelProgress from './components/LevelProgress';

interface ProfileData {
    user: {
        name: string;
        email: string;
        created_at: string;
        level: number;
        experience_points: number;
        avatar?: string;
    };
    stats: {
        total_games: number;
        total_points: number;
        accuracy: number;
        avg_response_time: number;
        achievements: Array<{
            id: number;
            name: string;
            description: string;
            unlocked_at: string;
        }>;
    };
    level_progress: {
        current_level: number;
        current_xp: number;
        next_level_xp: number;
        progress_percentage: number;
    };
    rankings: Array<{
        period: string;
        score: number;
        rank: number;
    }>;
}

const Profile: React.FC = () => {
    const intl = useIntl();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/profile');
                setProfileData(response.data);
                setError(null);
            } catch (err) {
                setError(intl.formatMessage({ 
                    id: 'profile.error.loading', 
                    defaultMessage: 'Error al cargar el perfil' 
                }));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [intl]);

    if (loading) {
        return (
            <div className="profile-container loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error || !profileData) {
        return (
            <div className="profile-container error">
                <div className="error-message">
                    {error || intl.formatMessage({ 
                        id: 'profile.error.generic', 
                        defaultMessage: 'Ha ocurrido un error' 
                    })}
                </div>
            </div>
        );
    }
    
    return (
        <div className="profile-container">
            {/* Cabecera del perfil */}
            <div className="profile-header">
                <div className="profile-avatar">
                    {profileData.user.avatar ? (
                        <img src={profileData.user.avatar} alt="Avatar" />
                    ) : (
                        <FontAwesomeIcon icon={faUser} className="default-avatar" />
                    )}
                </div>
                <div className="profile-info">
                    <h2>{profileData.user.name}</h2>
                    <LevelProgress progress={profileData.level_progress} />
                </div>
            </div>

            {/* Navegación entre secciones */}
            <div className="profile-nav">
                <button 
                    className={`nav-button ${activeTab === 'stats' ? 'active' : ''}`}
                    onClick={() => setActiveTab('stats')}
                >
                    <FontAwesomeIcon icon={faChartLine} />
                    <span>{intl.formatMessage({ id: 'profile.nav.stats', defaultMessage: 'Estadísticas' })}</span>
                </button>
                <button 
                    className={`nav-button ${activeTab === 'achievements' ? 'active' : ''}`}
                    onClick={() => setActiveTab('achievements')}
                >
                    <FontAwesomeIcon icon={faTrophy} />
                    <span>{intl.formatMessage({ id: 'profile.nav.achievements', defaultMessage: 'Logros' })}</span>
                </button>
                <button 
                    className={`nav-button ${activeTab === 'rankings' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rankings')}
                >
                    <FontAwesomeIcon icon={faMedal} />
                    <span>{intl.formatMessage({ id: 'profile.nav.rankings', defaultMessage: 'Rankings' })}</span>
                </button>
            </div>

            {/* Contenido principal */}
            <div className="profile-content">
                {activeTab === 'stats' && (
                    <div className="stats-container">
                        <UserStats stats={profileData.stats} />
                    </div>
                )}

                {activeTab === 'achievements' && (
                    <Achievements achievements={profileData.stats.achievements} />
                )}

                {activeTab === 'rankings' && (
                    <div className="rankings-container">
                        {profileData.rankings.map((ranking, index) => (
                            <div key={index} className="ranking-card">
                                <h3>{intl.formatMessage({ 
                                    id: `profile.ranking.${ranking.period}`,
                                    defaultMessage: ranking.period.charAt(0).toUpperCase() + ranking.period.slice(1)
                                })}</h3>
                                <div className="ranking-info">
                                    <span className="rank">#{ranking.rank}</span>
                                    <span className="score">{ranking.score} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile; 