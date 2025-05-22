import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import axios from '../../../config/axios';
import '../../../styles/components/Auth.css';

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const intl = useIntl();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
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
            const response = await axios.post('/api/register', formData);
            localStorage.setItem('token', response.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(intl.formatMessage({ id: 'auth.registerError', defaultMessage: 'Error al registrar usuario' }));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>
                    <FormattedMessage id="auth.register" defaultMessage="Registro" />
                </h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">
                            <FormattedMessage id="auth.name" defaultMessage="Nombre" />
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder={intl.formatMessage({ id: 'auth.name', defaultMessage: 'Nombre' })}
                            required
                        />
                    </div>
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
                    <div className="form-group">
                        <label htmlFor="password_confirmation">
                            <FormattedMessage id="auth.confirmPassword" defaultMessage="Confirmar Contraseña" />
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder={intl.formatMessage({ id: 'auth.confirmPassword', defaultMessage: 'Confirmar Contraseña' })}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        <FormattedMessage id="auth.signup" defaultMessage="Registrarse" />
                    </button>
                </form>
                <p className="auth-link">
                    <FormattedMessage
                        id="auth.hasAccount"
                        defaultMessage="¿Ya tienes cuenta? {loginLink}"
                        values={{
                            loginLink: (
                                <span onClick={() => navigate('/login')}>
                                    <FormattedMessage id="auth.login" defaultMessage="Inicia Sesión" />
                                </span>
                            )
                        }}
                    />
                </p>
            </div>
        </div>
    );
};

export default Signup; 