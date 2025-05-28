import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios, { setAuthToken } from '../../../config/axios';
import '../../../styles/components/Auth.css';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const intl = useIntl();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            const token = response.data.access_token;
            setAuthToken(token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(intl.formatMessage({ id: 'auth.invalidCredentials', defaultMessage: 'Credenciales inválidas' }));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>
                    <FormattedMessage id="auth.login" defaultMessage="Iniciar Sesión" />
                </h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">
                            <FormattedMessage id="auth.email" defaultMessage="Email" />
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder={intl.formatMessage({ id: 'auth.email', defaultMessage: 'Email' })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">
                            <FormattedMessage id="auth.password" defaultMessage="Contraseña" />
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={intl.formatMessage({ id: 'auth.password', defaultMessage: 'Contraseña' })}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        <FormattedMessage id="auth.login" defaultMessage="Iniciar Sesión" />
                    </button>
                </form>
                <p className="auth-link">
                    <FormattedMessage
                        id="auth.noAccount"
                        defaultMessage="¿No tienes cuenta? {signupLink}"
                        values={{
                            signupLink: (
                                <span onClick={() => navigate('/signup')}>
                                    <FormattedMessage id="auth.signup" defaultMessage="Regístrate" />
                                </span>
                            )
                        }}
                    />
                </p>
            </div>
        </div>
    );
};

export default Login; 