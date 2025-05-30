import axios from 'axios';

// Configuración base de Axios
const getBaseUrl = () => {
    // Si hay una variable de entorno definida, usarla
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    // Si estamos en localhost, usar localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }

    // En remoto, usar la IP específica del servidor
    return 'http://192.168.236.192:8000';
};

const API_BASE_URL = getBaseUrl();
console.log('API Base URL:', API_BASE_URL); // Para debug

// Configuración inicial de axios
const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Variable para evitar múltiples intentos de refresco simultáneos
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor para manejar errores
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                try {
                    // Esperar a que el token se refresque
                    const token = await new Promise((resolve, reject) => {
                        failedQueue.push({ resolve, reject });
                    });
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    return Promise.reject(err);
                }
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Intentar obtener un nuevo token (aquí deberías implementar tu lógica de refresco)
                const response = await axiosInstance.post('/api/refresh-token');
                const token = response.data.access_token;
                
                setAuthToken(token);
                processQueue(null, token);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Si el refresco falla, entonces sí cerrar la sesión
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Función para configurar el token de autenticación
export const setAuthToken = (token: string) => {
    if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
    } else {
        delete axiosInstance.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
    }
};

export default axiosInstance; 