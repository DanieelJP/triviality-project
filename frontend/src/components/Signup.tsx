import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Usamos el nuevo archivo de estilos compartidos

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Borrar errores cuando el usuario comienza a escribir
        if (errors[name as keyof typeof errors]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }

        // Validar confirmación de contraseña
        if (name === 'confirmPassword' || (name === 'password' && formData.confirmPassword)) {
            if (name === 'password' && value !== formData.confirmPassword) {
                setErrors(prevState => ({
                    ...prevState,
                    confirmPassword: 'Las contraseñas no coinciden'
                }));
            } else if (name === 'confirmPassword' && value !== formData.password) {
                setErrors(prevState => ({
                    ...prevState,
                    confirmPassword: 'Las contraseñas no coinciden'
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    confirmPassword: ''
                }));
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        // Validar nombre de usuario
        if (!formData.username.trim()) {
            newErrors.username = 'El nombre de usuario es obligatorio';
            isValid = false;
        }

        // Validar email
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
            isValid = false;
        }

        // Validar contraseña
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
            isValid = false;
        }

        // Validar confirmación de contraseña
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Debes confirmar la contraseña';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            // Aquí iría la lógica de registro
            console.log('Registrando usuario:', formData);
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre de usuario</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Identificador único"
                        />
                        {errors.username && <div className="error-message">{errors.username}</div>}
                    </div>
                    <div className="form-group">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                        />
                        {errors.email && <div className="error-message">{errors.email}</div>}
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
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirmación de contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="************"
                        />
                        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
                    </div>
                    <button type="submit" className="sign-up-button">
                        SIGN UP
                    </button>
                </form>
                <p className="login-text">¿Ya tienes una cuenta?</p>
                <button className="login-button" onClick={goToLogin}>
                    LOG IN
                </button>
            </div>
        </div>
    );
};

export default Signup; 