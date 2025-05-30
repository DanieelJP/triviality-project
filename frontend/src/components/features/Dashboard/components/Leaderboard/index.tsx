import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import axios from '../../../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faUser, faFilter } from '@fortawesome/free-solid-svg-icons';
import './Leaderboard.css';

interface LeaderboardEntry {
    name: string;
    avatar: string;
    score: number;
    rank: number;
}

interface UserRanking {
    rank: number;
    score: number;
    total_players: number;
}

const Leaderboard: React.FC = () => {
    const intl = useIntl();
    const [period, setPeriod] = useState('daily');
    const [category, setCategory] = useState<string | null>(null);
    const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
    const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);

    const periods = [
        { value: 'daily', label: intl.formatMessage({ id: 'leaderboard.period.daily' }) },
        { value: 'weekly', label: intl.formatMessage({ id: 'leaderboard.period.weekly' }) },
        { value: 'monthly', label: intl.formatMessage({ id: 'leaderboard.period.monthly' }) },
        { value: 'all_time', label: intl.formatMessage({ id: 'leaderboard.period.allTime' }) }
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/trivia/categories');
                setCategories(response.data);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchRankings = async () => {
            setLoading(true);
            try {
                const [rankingsResponse, userRankingResponse] = await Promise.all([
                    axios.get('/api/leaderboard', {
                        params: {
                            period,
                            category,
                            limit: 10
                        }
                    }),
                    axios.get('/api/leaderboard/user', {
                        params: {
                            period,
                            category
                        }
                    })
                ]);

                setRankings(rankingsResponse.data.ranking);
                setUserRanking(userRankingResponse.data);
                setError(null);
            } catch (err) {
                setError(intl.formatMessage({ id: 'leaderboard.error.loading' }));
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, [period, category, intl]);

    const getMedalColor = (rank: number) => {
        switch (rank) {
            case 1: return 'gold';
            case 2: return 'silver';
            case 3: return 'bronze';
            default: return 'default';
        }
    };

    if (loading) {
        return (
            <div className="leaderboard-container loading">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="leaderboard-container error">
                <div className="error-message">{error}</div>
            </div>
        );
    }
    
    return (
        <div className="leaderboard-container">
            {/* Filtros */}
            <div className="leaderboard-filters">
                <div className="period-filter">
                    {periods.map((p) => (
                        <button
                            key={p.value}
                            className={`filter-button ${period === p.value ? 'active' : ''}`}
                            onClick={() => setPeriod(p.value)}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
                <div className="category-filter">
                    <button
                        className={`filter-button ${!category ? 'active' : ''}`}
                        onClick={() => setCategory(null)}
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        {intl.formatMessage({ id: 'leaderboard.filter.all', defaultMessage: 'Todas las categorías' })}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`filter-button ${category === cat ? 'active' : ''}`}
                            onClick={() => setCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabla de clasificación */}
            <div className="leaderboard-table">
                {rankings.map((entry) => (
                    <div key={entry.rank} className={`leaderboard-row rank-${getMedalColor(entry.rank)}`}>
                        <div className="rank">
                            <FontAwesomeIcon icon={faMedal} className={`medal ${getMedalColor(entry.rank)}`} />
                            #{entry.rank}
                        </div>
                        <div className="player">
                            {entry.avatar ? (
                                <img src={entry.avatar} alt="Avatar" className="player-avatar" />
                            ) : (
                                <FontAwesomeIcon icon={faUser} className="default-avatar" />
                            )}
                            <span className="player-name">{entry.name}</span>
                        </div>
                        <div className="score">{entry.score.toLocaleString()} pts</div>
                    </div>
                ))}
            </div>

            {/* Ranking del usuario */}
            {userRanking && (
                <div className="user-ranking">
                    <h3>
                        {intl.formatMessage({ 
                            id: 'leaderboard.yourRanking', 
                            defaultMessage: 'Tu Posición' 
                        })}
                    </h3>
                    <div className="ranking-details">
                        <div className="rank">#{userRanking.rank}</div>
                        <div className="score">{userRanking.score.toLocaleString()} pts</div>
                        <div className="total-players">
                            {intl.formatMessage(
                                { 
                                    id: 'leaderboard.totalPlayers', 
                                    defaultMessage: 'de {total} jugadores' 
                                },
                                { total: userRanking.total_players }
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard; 