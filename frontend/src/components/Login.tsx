import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica de inicio de sesión
        console.log('Iniciando sesión:', formData);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="var_mir1"
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
                        />
                    </div>
                    <button type="submit" className="login-button">
                        LOG IN
                    </button>
                </form>
                <p className="login-text">¿No tienes una cuenta?</p>
                <button className="sign-up-button">
                    SIGN UP
                </button>
            </div>
        </div>
    );
};

export default Login;
