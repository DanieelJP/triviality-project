import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { setAuthToken } from '../config/axios';
import './AuthStyles.css'; // Usamos el nuevo archivo de estilos compartidos

// Configuración global de Axios
axios.defaults.withCredentials = true;

const Signup: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    const [errors, setErrors] = useState<{[key: string]: string}>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Limpiar error cuando el usuario comienza a escribir
        if (errors[name]) {
            setErrors(prevState => ({
                ...prevState,
                [name]: ''
            }));
        }

        // Validar confirmación de contraseña
        if (name === 'password_confirmation' || (name === 'password' && formData.password_confirmation)) {
            if (name === 'password' && value !== formData.password_confirmation) {
                setErrors(prevState => ({
                    ...prevState,
                    password_confirmation: 'Las contraseñas no coinciden'
                }));
            } else if (name === 'password_confirmation' && value !== formData.password) {
                setErrors(prevState => ({
                    ...prevState,
                    password_confirmation: 'Las contraseñas no coinciden'
                }));
            } else {
                setErrors(prevState => ({
                    ...prevState,
                    password_confirmation: ''
                }));
            }
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = 'Debes confirmar la contraseña';
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm()) {
            try {
                const response = await axios.post('/api/register', formData);
                const { access_token, user } = response.data;
                
                // Guardar el token y la información del usuario
                localStorage.setItem('token', access_token);
                localStorage.setItem('user', JSON.stringify(user));
                
                // Configurar el token para futuras peticiones
                setAuthToken(access_token);
                
                // Redirigir al usuario
                navigate('/trivia');
            } catch (error: any) {
                if (error.response?.data?.errors) {
                    setErrors(error.response.data.errors);
                } else {
                    setErrors({
                        general: 'Error al registrar usuario. Por favor, inténtalo de nuevo.'
                    });
                }
            }
        }
    };

    const goToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="login-title">Sign Up</h1>
                {errors.general && <div className="error-message">{errors.general}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>
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
                            required
                        />
                        {errors.password && <div className="error-message">{errors.password}</div>}
                    </div>
                    <div className="form-group">
                        <label>Confirmación de contraseña</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="************"
                            required
                        />
                        {errors.password_confirmation && <div className="error-message">{errors.password_confirmation}</div>}
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