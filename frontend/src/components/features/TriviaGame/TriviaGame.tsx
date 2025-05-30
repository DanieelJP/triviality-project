import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Question, Difficulty, SupportedLanguage } from '../../../types/trivia';
import { triviaService } from '../../../services/triviaService';
import logo from '../../../assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faLanguage } from '@fortawesome/free-solid-svg-icons';
import LoadingScreen from './LoadingScreen';
import './TriviaGame.css';

interface GameAnswer {
    question: string;
    given_answer: string;
    correct_answer: string;
    is_correct: boolean;
    response_time: number;
    points_earned: number;
}

interface GameResult {
    answers: GameAnswer[];
    bonuses?: {
        streak: number;
        quick: number;
        difficulty: number;
    };
    experience_gained?: number;
    new_level?: number;
    experience_points?: number;
    next_level_xp?: number;
    progress?: number;
}

const TriviaGame: React.FC = () => {
    const navigate = useNavigate();
    const intl = useIntl();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('es');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [scoreUpdated, setScoreUpdated] = useState<boolean>(false);
    const [answersOrder, setAnswersOrder] = useState<{ [key: number]: string[] }>({});
    const [gameResult, setGameResult] = useState<GameResult>({ answers: [] });
    const [startTime, setStartTime] = useState<number>(0);
    
    // Mapa de idiomas para mostrar al usuario - ahora utilizando traducciones
    const languageMap: Record<SupportedLanguage, string> = {
        'sq': intl.formatMessage({ id: 'language.sq', defaultMessage: 'Albanés' }), 
        'de': intl.formatMessage({ id: 'language.de', defaultMessage: 'Alemán' }), 
        'ar': intl.formatMessage({ id: 'language.ar', defaultMessage: 'Árabe' }), 
        'az': intl.formatMessage({ id: 'language.az', defaultMessage: 'Azerbaiyani' }), 
        'eu': intl.formatMessage({ id: 'language.eu', defaultMessage: 'Vasco' }), 
        'bn': intl.formatMessage({ id: 'language.bn', defaultMessage: 'Bengalí' }), 
        'bg': intl.formatMessage({ id: 'language.bg', defaultMessage: 'Búlgaro' }), 
        'cs': intl.formatMessage({ id: 'language.cs', defaultMessage: 'Checo' }), 
        'zh': intl.formatMessage({ id: 'language.zh', defaultMessage: 'Chino' }), 
        'zt': intl.formatMessage({ id: 'language.zt', defaultMessage: 'Chino (tradicional)' }), 
        'ko': intl.formatMessage({ id: 'language.ko', defaultMessage: 'Coreano' }), 
        'da': intl.formatMessage({ id: 'language.da', defaultMessage: 'Danés' }), 
        'sk': intl.formatMessage({ id: 'language.sk', defaultMessage: 'Eslovaco' }), 
        'sl': intl.formatMessage({ id: 'language.sl', defaultMessage: 'Esloveno' }), 
        'es': intl.formatMessage({ id: 'language.es', defaultMessage: 'Español' }), 
        'eo': intl.formatMessage({ id: 'language.eo', defaultMessage: 'Esperanto' }), 
        'et': intl.formatMessage({ id: 'language.et', defaultMessage: 'Estonio' }), 
        'fi': intl.formatMessage({ id: 'language.fi', defaultMessage: 'Finlandés' }), 
        'fr': intl.formatMessage({ id: 'language.fr', defaultMessage: 'Francés' }), 
        'gl': intl.formatMessage({ id: 'language.gl', defaultMessage: 'Gallego' }), 
        'el': intl.formatMessage({ id: 'language.el', defaultMessage: 'Griego' }), 
        'he': intl.formatMessage({ id: 'language.he', defaultMessage: 'Hebreo' }), 
        'hi': intl.formatMessage({ id: 'language.hi', defaultMessage: 'Hindi' }), 
        'nl': intl.formatMessage({ id: 'language.nl', defaultMessage: 'Holandés' }), 
        'hu': intl.formatMessage({ id: 'language.hu', defaultMessage: 'Húngaro' }), 
        'id': intl.formatMessage({ id: 'language.id', defaultMessage: 'Indonesio' }), 
        'en': intl.formatMessage({ id: 'language.en', defaultMessage: 'Inglés' }), 
        'ga': intl.formatMessage({ id: 'language.ga', defaultMessage: 'Irlandés' }), 
        'it': intl.formatMessage({ id: 'language.it', defaultMessage: 'Italiano' }), 
        'ja': intl.formatMessage({ id: 'language.ja', defaultMessage: 'Japonés' }), 
        'lv': intl.formatMessage({ id: 'language.lv', defaultMessage: 'Letón' }), 
        'lt': intl.formatMessage({ id: 'language.lt', defaultMessage: 'Lituano' }), 
        'ms': intl.formatMessage({ id: 'language.ms', defaultMessage: 'Malayo' }), 
        'nb': intl.formatMessage({ id: 'language.nb', defaultMessage: 'Noruego' }), 
        'fa': intl.formatMessage({ id: 'language.fa', defaultMessage: 'Persa' }), 
        'pl': intl.formatMessage({ id: 'language.pl', defaultMessage: 'Polaco' }), 
        'pt': intl.formatMessage({ id: 'language.pt', defaultMessage: 'Portugués' }), 
        'pt-BR': intl.formatMessage({ id: 'language.pt-BR', defaultMessage: 'Portugués (Brasil)' }), 
        'ro': intl.formatMessage({ id: 'language.ro', defaultMessage: 'Rumano' }), 
        'ru': intl.formatMessage({ id: 'language.ru', defaultMessage: 'Ruso' }), 
        'sr': intl.formatMessage({ id: 'language.sr', defaultMessage: 'Serbio' }), 
        'sv': intl.formatMessage({ id: 'language.sv', defaultMessage: 'Sueco' }), 
        'tl': intl.formatMessage({ id: 'language.tl', defaultMessage: 'Tagalo' }), 
        'th': intl.formatMessage({ id: 'language.th', defaultMessage: 'Tailandés' }), 
        'tr': intl.formatMessage({ id: 'language.tr', defaultMessage: 'Turco' }), 
        'uk': intl.formatMessage({ id: 'language.uk', defaultMessage: 'Ucraniano' }), 
        'ur': intl.formatMessage({ id: 'language.ur', defaultMessage: 'Urdu' }), 
        'vi': intl.formatMessage({ id: 'language.vi', defaultMessage: 'Vietnamita' })
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
        
        // Recuperar idioma guardado si existe
        const savedLanguage = localStorage.getItem('gameLanguage');
        if (savedLanguage && Object.keys(languageMap).includes(savedLanguage)) {
            setSelectedLanguage(savedLanguage as SupportedLanguage);
        }
    }, [navigate]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const results = await triviaService.getQuestions(10, selectedDifficulty, selectedLanguage);
            
            // Guardamos el idioma seleccionado para futuras partidas
            localStorage.setItem('gameLanguage', selectedLanguage);
            
            // Preordena las respuestas para cada pregunta y guarda el orden
            const orderMap: { [key: number]: string[] } = {};
            results.forEach((question, index) => {
                const allAnswers = [...question.incorrect_answers, question.correct_answer];
                // Usamos un orden aleatorio pero fijo para cada pregunta
                orderMap[index] = allAnswers.sort(() => Math.random() - 0.5);
            });
            
            setAnswersOrder(orderMap);
            setQuestions(results);
            setStartTime(Date.now());
            setError('');
            setGameStarted(true);
        } catch (err) {
            setError('Error al cargar las preguntas');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer: string) => {
        const endTime = Date.now();
        const responseTime = (endTime - startTime) / 1000; // tiempo en segundos
        const isCorrect = answer === questions[currentQuestion].correct_answer;
        
        // Calcular puntos basados en tiempo de respuesta y dificultad
        let points = isCorrect ? 10 : 0;
        if (isCorrect) {
            if (selectedDifficulty === 'hard') points = 30;
            else if (selectedDifficulty === 'medium') points = 20;
            
            // Bonus por respuesta rápida (menos de 5 segundos)
            if (responseTime < 5) points += 5;
        }

        // Guardar la respuesta
        const newAnswers = [...gameResult.answers, {
            question: questions[currentQuestion].question,
            given_answer: answer,
            correct_answer: questions[currentQuestion].correct_answer,
            is_correct: isCorrect,
            response_time: responseTime,
            points_earned: points
        }];

        setGameResult(prev => ({ ...prev, answers: newAnswers }));

        setSelectedAnswer(answer);
        setIsAnswerCorrect(isCorrect);

        if (isCorrect) {
            setScore(score + 1);
            setScoreUpdated(true);
            setTimeout(() => setScoreUpdated(false), 500);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        setSelectedAnswer(null);
        setIsAnswerCorrect(null);

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
            setStartTime(Date.now());
        } else {
            setShowScore(true);
            // Guardar resultados del juego
            try {
                const results = await triviaService.saveGameResults({
                    difficulty: selectedDifficulty,
                    category: questions[0].category,
                    answers: gameResult.answers
                });
                
                setGameResult(prev => ({
                    ...prev,
                    bonuses: results.bonuses,
                    experience_gained: results.experience_gained,
                    new_level: results.new_level,
                    experience_points: results.experience_points,
                    next_level_xp: results.next_level_xp,
                    progress: results.progress
                }));
                
                // Si la llamada fue exitosa, actualizar el nivel en localStorage
                if (results.new_level > parseInt(localStorage.getItem('userLevel') || '1')) {
                    localStorage.setItem('userLevel', results.new_level.toString());
                    localStorage.setItem('userXP', results.experience_points.toString());
                }
            } catch (error) {
                console.error('Error al guardar resultados:', error);
            }
        }
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setGameStarted(false);
        setQuestions([]);
        setGameResult({ answers: [] });
    };

    if (loading) return (
        <LoadingScreen 
            isLoading={true} 
            text={intl.formatMessage({ id: 'game.loading', defaultMessage: 'Preparando tus preguntas...' })} 
            backButton={
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>
                        <FormattedMessage id="nav.back" defaultMessage="Volver" />
                    </span>
                </Link>
            }
        />
    );

    if (error) return (
        <>
            <div className="trivia-container">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>
                        <FormattedMessage id="nav.back" defaultMessage="Volver" />
                    </span>
                </Link>
                <div className="trivia-card">
                    <h2 className="trivia-title">
                        <FormattedMessage id="game.error" defaultMessage="Oops! Algo salió mal" />
                    </h2>
                    <p className="error-text" style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
                        {error}
                    </p>
                    <button className="retry-button" onClick={fetchQuestions}>
                        <FormattedMessage id="game.retry" defaultMessage="Reintentar" />
                    </button>
                </div>
            </div>
            <div className="logo-center">
                <img src={logo} alt="Triviality Logo" className="triviality-logo" />
            </div>
        </>
    );

    if (!gameStarted) {
        return (
            <>
                <div className="trivia-container">
                    <Link to="/dashboard" className="back-button">
                        <FontAwesomeIcon icon={faArrowLeft} /> <span>
                            <FormattedMessage id="nav.back" defaultMessage="Volver" />
                        </span>
                    </Link>
                    <div className="trivia-card">
                        <h2 className="trivia-title">
                            <FormattedMessage id="app.title" defaultMessage="¡Bienvenido a Triviality!" />
                        </h2>
                        <div className="difficulty-section">
                            <label className="difficulty-label">
                                <FormattedMessage id="game.selectDifficulty" defaultMessage="Selecciona la dificultad:" />
                            </label>
                            <div className="difficulty-buttons">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                    >
                                        <FormattedMessage 
                                            id={`game.difficult.${difficulty}`} 
                                            defaultMessage={difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="language-section">
                            <label className="language-label">
                                <FormattedMessage id="game.selectLanguage" defaultMessage="Selecciona el idioma:" />
                            </label>
                            <div className="language-select-container">
                                <FontAwesomeIcon icon={faLanguage} className="language-icon" />
                                <select 
                                    className="language-select"
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                                >
                                    {Object.entries(languageMap).map(([code, name]) => (
                                        <option key={code} value={code}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="button-container">
                            <button className="start-game-button" onClick={fetchQuestions}>
                                <FormattedMessage id="game.start" defaultMessage="Comenzar Juego" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="logo-center">
                    <img src={logo} alt="Triviality Logo" className="triviality-logo" />
                </div>
            </>
        );
    }
    
    if (questions.length === 0) return null;
    
    if (showScore) {
        // Calcular estadísticas
        const correctAnswers = score;
        const incorrectAnswers = questions.length - score;
        const percentage = Math.round((score / questions.length) * 100);
        
        // Determinar mensaje según el porcentaje
        let messageId = '';
        if (percentage >= 90) {
            messageId = 'game.feedback.excellent';
        } else if (percentage >= 70) {
            messageId = 'game.feedback.veryGood';
        } else if (percentage >= 50) {
            messageId = 'game.feedback.good';
        } else if (percentage >= 30) {
            messageId = 'game.feedback.fair';
        } else {
            messageId = 'game.feedback.needsPractice';
        }
        
        return (
            <div className="score-container">
                <h2>
                    <FormattedMessage id={messageId} />
                        </h2>
                
                <div className="score-summary">
                    <div className="score-item">
                        <span className="score-label">
                            <FormattedMessage id="game.score.total" defaultMessage="Puntuación Total" />
                        </span>
                        <span className="score-value">{score}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">
                            <FormattedMessage id="game.score.correct" defaultMessage="Respuestas Correctas" />
                        </span>
                        <span className="score-value">{correctAnswers}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">
                            <FormattedMessage id="game.score.incorrect" defaultMessage="Respuestas Incorrectas" />
                        </span>
                        <span className="score-value">{incorrectAnswers}</span>
                    </div>
                    <div className="score-item">
                        <span className="score-label">
                            <FormattedMessage id="game.score.accuracy" defaultMessage="Precisión" />
                        </span>
                        <span className="score-value">{percentage}%</span>
                    </div>
                </div>

                {/* Mostrar experiencia ganada y bonificaciones */}
                <div className="experience-summary">
                    <h3>
                        <FormattedMessage id="game.experience.title" defaultMessage="Experiencia Ganada" />
                    </h3>
                    <div className="experience-details">
                        <div className="experience-item">
                            <span className="experience-label">
                                <FormattedMessage id="game.experience.base" defaultMessage="Base" />
                            </span>
                            <span className="experience-value">+{score} XP</span>
                        </div>
                        {gameResult.bonuses && gameResult.bonuses.streak > 0 && (
                            <div className="experience-item bonus">
                                <span className="experience-label">
                                    <FormattedMessage 
                                        id="game.experience.streakBonus" 
                                        defaultMessage="Bonus por Racha" 
                                    />
                                </span>
                                <span className="experience-value">+{gameResult.bonuses.streak} XP</span>
                            </div>
                        )}
                        {gameResult.bonuses && gameResult.bonuses.quick > 0 && (
                            <div className="experience-item bonus">
                                <span className="experience-label">
                            <FormattedMessage 
                                        id="game.experience.quickBonus" 
                                        defaultMessage="Bonus por Rapidez" 
                                    />
                                </span>
                                <span className="experience-value">+{gameResult.bonuses.quick} XP</span>
                            </div>
                        )}
                        {gameResult.bonuses && gameResult.bonuses.difficulty > 0 && (
                            <div className="experience-item bonus">
                                <span className="experience-label">
                            <FormattedMessage 
                                        id="game.experience.difficultyBonus" 
                                        defaultMessage="Bonus por Dificultad" 
                                    />
                                </span>
                                <span className="experience-value">+{gameResult.bonuses.difficulty} XP</span>
                            </div>
                        )}
                        <div className="experience-item total">
                            <span className="experience-label">
                                <FormattedMessage id="game.experience.total" defaultMessage="Total" />
                            </span>
                            <span className="experience-value">+{gameResult.experience_gained || 0} XP</span>
                        </div>
                    </div>

                    {/* Mostrar progreso de nivel si subió */}
                    {gameResult.new_level && gameResult.new_level > parseInt(localStorage.getItem('userLevel') || '1') && (
                        <div className="level-up-notification">
                            <h3>
                                <FormattedMessage 
                                    id="game.levelUp" 
                                    defaultMessage="¡Has subido al nivel {level}!" 
                                    values={{ level: gameResult.new_level }}
                                />
                            </h3>
                            <div className="level-progress">
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill" 
                                        style={{ width: `${gameResult.progress || 0}%` }}
                                    />
                                </div>
                                <div className="progress-text">
                                    {gameResult.experience_points || 0} / {gameResult.next_level_xp || 0} XP
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="score-actions">
                    <button onClick={restartGame} className="button primary">
                        <FormattedMessage id="game.playAgain" defaultMessage="Jugar de Nuevo" />
                    </button>
                    <Link to="/dashboard" className="button secondary">
                        <FormattedMessage id="game.backToDashboard" defaultMessage="Volver al Dashboard" />
                    </Link>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    // En lugar de ordenar las respuestas aquí, usamos el orden pre-establecido
    const allAnswers = answersOrder[currentQuestion] || [];

    return (
        <>
            <div className="trivia-container">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>
                        <FormattedMessage id="nav.back" defaultMessage="Volver" />
                    </span>
                </Link>
                <div className="trivia-card">
                    <div className="game-header">
                        <span className="question-counter">
                            <FormattedMessage 
                                id="game.question" 
                                defaultMessage="Pregunta {current} de {total}" 
                                values={{ current: currentQuestion + 1, total: questions.length }}
                            />
                        </span>
                        <span className={`score-counter ${scoreUpdated ? 'score-updated' : ''}`}>
                            <FormattedMessage 
                                id="game.score.counter" 
                                defaultMessage="Puntuación: {score}" 
                                values={{ score }}
                            />
                        </span>
                    </div>
                    <div className="tags-container">
                        <span className="category-tag">
                            {currentQ.category}
                        </span>
                        <span className="difficulty-tag">
                            <FormattedMessage 
                                id={`game.difficult.${currentQ.difficulty}`} 
                                defaultMessage={
                                    currentQ.difficulty === 'easy' ? 'Fácil' : 
                                    currentQ.difficulty === 'medium' ? 'Medio' : 'Difícil'
                                } 
                            />
                        </span>
                        <span className="language-tag">
                            <FontAwesomeIcon icon={faLanguage} /> {languageMap[selectedLanguage]}
                        </span>
                    </div>
                    <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQ.question }}></h2>
                    <div className="answers-container">
                        {allAnswers.map((answer, index) => {
                            let buttonClass = 'answer-button';
                            if (selectedAnswer) {
                                if (answer === currentQ.correct_answer) {
                                    buttonClass += ' correct';
                                } else if (answer === selectedAnswer && answer !== currentQ.correct_answer) {
                                    buttonClass += ' incorrect';
                                }
                            }
                            return (
                                <button
                                    key={index}
                                    onClick={() => !selectedAnswer && handleAnswer(answer)}
                                    className={buttonClass}
                                    dangerouslySetInnerHTML={{ __html: answer }}
                                    disabled={!!selectedAnswer}
                                ></button>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="logo-center game-logo-container">
                <img src={logo} alt="Triviality Logo" className="triviality-logo game-logo" />
            </div>
        </>
    );
};

export default TriviaGame; 