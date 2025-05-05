import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get('/api/user');
          setUser(response.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData) => {
    setError('');
    try {
      const response = await axios.post('/api/login', data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/trivia');
      return true;
    } catch (err) {
      setError('Credenciales inválidas');
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    setError('');
    try {
      const response = await axios.post('/api/register', data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/trivia');
      return true;
    } catch (err) {
      setError('Error al registrar usuario');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = !!user;

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };
}; 