# Triviality Project

## Comandos para Iniciar el Proyecto

### 1. Backend (Laravel)
```bash
# Instalar dependencias
composer install

# Configurar entorno
cp .env.example .env
php artisan key:generate

# Configurar base de datos en .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=triviality_db
# DB_USERNAME=laraveluser
# DB_PASSWORD=Bifidus42

# Crear base de datos
mysql -u laraveluser -p
CREATE DATABASE triviality;
exit;

# Migrar base de datos
php artisan migrate

# Iniciar servidor Laravel
cd backend
php artisan serve
```

### 2. Frontend (React)
```bash
# Entrar al directorio frontend
cd frontend

# Instalar dependencias
npm install

# Configurar vite.config.ts
# Asegúrate de que el archivo vite.config.ts tenga esta configuración:
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public/dist',
    emptyOutDir: true
  }
})

# Compilar el frontend
npm run build
```

### 3. Configurar Apache
```bash
# Habilitar módulos
sudo a2enmod proxy proxy_http rewrite headers

# Crear virtual host
sudo nano /etc/apache2/sites-available/triviality.conf

# Añadir configuración:
<VirtualHost *:80>
    ServerName triviality.local
    DocumentRoot /var/www/html/triviality-project/public

    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    <Directory /var/www/html/triviality-project/public>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Habilitar sitio y reiniciar Apache
sudo a2ensite triviality.conf
sudo systemctl restart apache2
```

### 4. Configurar Hosts
```bash
# Añadir dominio local
sudo nano /etc/hosts
# Añadir: 127.0.0.1 triviality.local
```

### 5. Dar Permisos
```bash
sudo chown -R www-data:www-data /var/www/html/triviality-project
sudo chmod -R 755 /var/www/html/triviality-project
```

## Verificar Instalación

1. Backend: http://localhost:8000/api/ejemplo
2. Frontend: http://triviality.local

## Requisitos Previos

- PHP 8.x
- Composer
- Node.js y npm
- MySQL
- Apache
- Ubuntu Server (o similar)

## Tecnologías Utilizadas

### Backend
- Laravel
- PHP
- MySQL

### Frontend
- React
- Axios

### Servidor
- Apache
- VirtualHost


## Estructura del Proyecto

```
triviality-project/
├── app/                    # Código de la aplicación Laravel
├── config/                 # Archivos de configuración
├── database/              # Migraciones y seeders
├── frontend/           Verificar   # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   └── App.tsx       # Componente principal
│   └── package.json      # Dependencias de React
├── public/                # Archivos públicos
├── routes/                # Rutas de la API
└── .env                   # Variables de entorno
```

## Endpoints de la API

- GET `/api/ejemplo`: Obtiene datos de ejemplo
- POST `/api/ejemplo`: Envía datos de ejemplo

## Solución de Problemas

Si encuentras problemas con los permisos:
```bash
sudo chown -R $USER:www-data /var/www/html/triviality-project
sudo chmod -R 775 /var/www/html/triviality-project
```

Si Apache no se reinicia:
```bash
sudo systemctl status apache2
sudo tail -f /var/log/apache2/error.log
```
