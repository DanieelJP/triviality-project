import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import axios from '../../../../../config/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal, faUser, faFilter, faClock, faBullseye, faGamepad } from '@fortawesome/free-solid-svg-icons';
import './Leaderboard.css';

interface LeaderboardEntry {
    name: string;
    avatar: string | null;
    level: number;
    score: number;
    rank: number;
    total_games: number;
    accuracy: number;
    avg_response_time: number;
}

interface UserRanking {
    rank: number;
    score: number;
    total_games: number;
    accuracy: number;
    avg_response_time: number;
    total_players: number;
}

interface Category {
    id: string;
    name: string;
}

const Leaderboard: React.FC = () => {
    const intl = useIntl();
    const [period, setPeriod] = useState('daily');
    const [category, setCategory] = useState<string | null>(null);
    const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
    const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const periods = [
        { value: 'daily', label: intl.formatMessage({ id: 'leaderboard.period.daily', defaultMessage: 'Hoy' }) },
        { value: 'weekly', label: intl.formatMessage({ id: 'leaderboard.period.weekly', defaultMessage: 'Esta semana' }) },
        { value: 'monthly', label: intl.formatMessage({ id: 'leaderboard.period.monthly', defaultMessage: 'Este mes' }) },
        { value: 'all_time', label: intl.formatMessage({ id: 'leaderboard.period.allTime', defaultMessage: 'Todo' }) }
    ];

    // Función auxiliar para formatear números con seguridad
    const formatNumber = (value: any, decimals: number = 1): string => {
        const num = Number(value);
        return isNaN(num) ? '0' : num.toFixed(decimals);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/trivia/categories');
                if (Array.isArray(response.data)) {
                    setCategories(response.data.map(cat => ({
                        id: cat,
                        name: cat
                    })));
                } else {
                    console.error('La respuesta de categorías no es un array:', response.data);
                    setCategories([]);
                }
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setCategories([]);
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

                // Asegurarse de que los datos numéricos sean números
                const processedRankings = rankingsResponse.data.map((entry: any) => ({
                    ...entry,
                    score: Number(entry.score) || 0,
                    total_games: Number(entry.total_games) || 0,
                    accuracy: Number(entry.accuracy) || 0,
                    avg_response_time: Number(entry.avg_response_time) || 0,
                    level: Number(entry.level) || 1
                }));

                const processedUserRanking = userRankingResponse.data ? {
                    ...userRankingResponse.data,
                    score: Number(userRankingResponse.data.score) || 0,
                    total_games: Number(userRankingResponse.data.total_games) || 0,
                    accuracy: Number(userRankingResponse.data.accuracy) || 0,
                    avg_response_time: Number(userRankingResponse.data.avg_response_time) || 0
                } : null;

                setRankings(processedRankings);
                setUserRanking(processedUserRanking);
                setError(null);
            } catch (err) {
                setError(intl.formatMessage({ 
                    id: 'leaderboard.error.loading',
                    defaultMessage: 'Error al cargar la clasificación'
                }));
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
                        {intl.formatMessage({ 
                            id: 'leaderboard.filter.all', 
                            defaultMessage: 'Todas las categorías' 
                        })}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`filter-button ${category === cat.id ? 'active' : ''}`}
                            onClick={() => setCategory(cat.id)}
                        >
                            {cat.name}
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
                            <div className="player-info">
                                <span className="player-name">{entry.name}</span>
                                <span className="player-level">
                                    {intl.formatMessage({ 
                                        id: 'leaderboard.level', 
                                        defaultMessage: 'Nivel {level}' 
                                    }, { level: entry.level })}
                                </span>
                            </div>
                        </div>
                        <div className="stats">
                            <div className="stat">
                                <FontAwesomeIcon icon={faGamepad} />
                                <span>{entry.total_games}</span>
                            </div>
                            <div className="stat">
                                <FontAwesomeIcon icon={faBullseye} />
                                <span>{formatNumber(entry.accuracy)}%</span>
                            </div>
                            <div className="stat">
                                <FontAwesomeIcon icon={faClock} />
                                <span>{formatNumber(entry.avg_response_time)}s</span>
                            </div>
                            <div className="score">{entry.score.toLocaleString()} pts</div>
                        </div>
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
                        <div className="stats">
                            <div className="stat">
                                <FontAwesomeIcon icon={faGamepad} />
                                <span>{userRanking.total_games}</span>
                            </div>
                            <div className="stat">
                                <FontAwesomeIcon icon={faBullseye} />
                                <span>{formatNumber(userRanking.accuracy)}%</span>
                            </div>
                            <div className="stat">
                                <FontAwesomeIcon icon={faClock} />
                                <span>{formatNumber(userRanking.avg_response_time)}s</span>
                            </div>
                            <div className="score">{userRanking.score.toLocaleString()} pts</div>
                        </div>
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