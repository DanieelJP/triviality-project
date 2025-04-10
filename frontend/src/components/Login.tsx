import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { setAuthToken } from '../config/axios';
import './AuthStyles.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            const response = await axios.post('/api/login', formData);
            const { access_token, user } = response.data;
            
            // Guardar el token y la información del usuario
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Configurar el token para futuras peticiones
            setAuthToken(access_token);
            
            // Redirigir al usuario
            navigate('/trivia');
        } catch (error: any) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                setError(Object.values(error.response.data.errors).join('\n'));
            } else {
                setError('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
            }
        }
    };

    const goToSignup = () => {
        navigate('/signup');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Log In</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="************"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        LOG IN
                    </button>
                </form>
                <p className="login-text">¿No tienes una cuenta?</p>
                <button className="sign-up-button" onClick={goToSignup}>
                    SIGN UP
                </button>
            </div>
        </div>
    );
};

export default Login;
