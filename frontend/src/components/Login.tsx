import React, { useState } from 'react';
import './Login.css';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        user: '',
        mail: '',
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
        // Aquí iría la lógica de registro
        console.log('Form submitted:', formData);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">SIGN IN</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>User</label>
                        <input
                            type="text"
                            name="user"
                            value={formData.user}
                            onChange={handleChange}
                            placeholder="var_mir1"
                        />
                    </div>
                    <div className="form-group">
                        <label>Mail</label>
                        <input
                            type="email"
                            name="mail"
                            value={formData.mail}
                            onChange={handleChange}
                            placeholder="example@gmail.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="************"
                        />
                    </div>
                    <button type="submit" className="sign-up-button">
                        SIGN UP
                    </button>
                </form>
                <p className="login-text">Do you have an account?</p>
                <button className="login-button">
                    LOG IN
                </button>
            </div>
        </div>
    );
};

export default Login;
