import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Question, Difficulty } from '../../../types/trivia';
import { triviaService } from '../../../services/triviaService';
import logo from '../../../assets/logo.png';
import '../../../styles/components/TriviaGame.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';

const TriviaGame: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [showScore, setShowScore] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [scoreUpdated, setScoreUpdated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchQuestions = async () => {
        try {
            setLoading(true);
            const results = await triviaService.getQuestions(10, selectedDifficulty);
            setQuestions(results);
            setError('');
            setGameStarted(true);
        } catch (err) {
            setError('Error al cargar las preguntas');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = async (answer: string) => {
        setSelectedAnswer(answer);
        const isCorrect = answer === questions[currentQuestion].correct_answer;
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
        } else {
            setShowScore(true);
        }
    };

    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setGameStarted(false);
        setQuestions([]);
    };

    if (loading) return (
        <>
            <div className="trivia-container">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>Volver</span>
                </Link>
                <div className="trivia-card">
                    <h2 className="trivia-title">Preparando tus preguntas</h2>
                    <div className="loader-container">
                        <div className="loader"></div>
                    </div>
                    <p className="text-center" style={{ marginTop: '1rem', color: '#555' }}>
                        Estamos seleccionando las mejores preguntas para ti...
                    </p>
                </div>
            </div>
            <div className="logo-center">
                <img src={logo} alt="Triviality Logo" className="triviality-logo" />
            </div>
        </>
    );

    if (error) return (
        <>
            <div className="trivia-container">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>Volver</span>
                </Link>
                <div className="trivia-card">
                    <h2 className="trivia-title">Oops! Algo salió mal</h2>
                    <p className="error-text" style={{ textAlign: 'center', marginBottom: '2rem', color: '#555' }}>
                        {error}
                    </p>
                    <button className="retry-button" onClick={fetchQuestions}>
                        Reintentar
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
                        <FontAwesomeIcon icon={faArrowLeft} /> <span>Volver</span>
                    </Link>
                    <div className="trivia-card">
                        <h2 className="trivia-title">¡Bienvenido a Triviality!</h2>
                        <div className="difficulty-section">
                            <label className="difficulty-label">
                                Selecciona la dificultad:
                            </label>
                            <div className="difficulty-buttons">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((difficulty) => (
                                    <button
                                        key={difficulty}
                                        onClick={() => setSelectedDifficulty(difficulty)}
                                        className={`difficulty-button ${selectedDifficulty === difficulty ? 'selected' : ''}`}
                                    >
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="button-container">
                            <button className="start-button" onClick={fetchQuestions}>
                                Play
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
        let message = '';
        if (percentage >= 90) {
            message = '¡Excelente! Eres un maestro del trivia.';
        } else if (percentage >= 70) {
            message = '¡Muy bien! Tienes un gran conocimiento.';
        } else if (percentage >= 50) {
            message = 'Buen trabajo. Tienes un conocimiento decente.';
        } else if (percentage >= 30) {
            message = 'No está mal, pero puedes mejorar.';
        } else {
            message = 'Sigue practicando para mejorar tu puntuación.';
        }
        
        return (
            <>
                <div className="trivia-container">
                    <Link to="/dashboard" className="back-button">
                        <FontAwesomeIcon icon={faArrowLeft} /> <span>Volver</span>
                    </Link>
                    <div className="trivia-card">
                        <div className="results-container">
                            <h2 className="results-heading">¡Juego terminado!</h2>
                            <div className="results-score">{percentage}%</div>
                            <p className="results-message">{message}</p>
                            
                            <div className="score-details">
                                <div className="score-detail">
                                    <div className="score-detail-label">Total</div>
                                    <div className="score-detail-value">{questions.length}</div>
                                </div>
                                <div className="score-detail">
                                    <div className="score-detail-label">Correctas</div>
                                    <div className="score-detail-value correct">{correctAnswers}</div>
                                </div>
                                <div className="score-detail">
                                    <div className="score-detail-label">Incorrectas</div>
                                    <div className="score-detail-value incorrect">{incorrectAnswers}</div>
                                </div>
                            </div>
                            
                            <button className="play-again-button" onClick={restartGame}>
                                Jugar de nuevo
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

    const currentQ = questions[currentQuestion];
    const allAnswers = [...currentQ.incorrect_answers, currentQ.correct_answer]
        .sort(() => Math.random() - 0.5);

    return (
        <>
            <div className="trivia-container">
                <Link to="/dashboard" className="back-button">
                    <FontAwesomeIcon icon={faArrowLeft} /> <span>Volver</span>
                </Link>
                <div className="trivia-card">
                    <div className="game-header">
                        <span className="question-counter">
                            Pregunta {currentQuestion + 1} de {questions.length}
                        </span>
                        <span className={`score-counter ${scoreUpdated ? 'score-updated' : ''}`}>
                            Puntuación: {score}
                        </span>
                    </div>
                    <div className="tags-container">
                        <span className="category-tag">
                            {currentQ.category}
                        </span>
                        <span className="difficulty-tag">
                            {currentQ.difficulty.toUpperCase()}
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
            <div className="logo-center">
                <img src={logo} alt="Triviality Logo" className="triviality-logo game-logo" />
            </div>
        </>
    );
};

export default TriviaGame; 