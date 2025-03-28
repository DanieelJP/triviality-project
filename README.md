# Triviality Project

## Descripción
Triviality es un juego de preguntas y respuestas basado en la API Open Trivia Database. El proyecto utiliza Laravel para el backend y React para el frontend.

## Requisitos Previos
- PHP 8.x
- Composer
- Node.js y npm
- MySQL
- Apache
- Ubuntu Server (o similar)

## Configuración del Entorno

### 1. Backend (Laravel)
```bash
# Entrar al directorio backend
cd backend

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

# Iniciar servidor de desarrollo
npm start
```

### 3. Configuración de Apache
```bash
# Habilitar módulos necesarios
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite

# Configurar VirtualHost
sudo nano /etc/apache2/sites-available/triviality.conf
```

#### Configuración para Desarrollo
```apache
<VirtualHost *:80>
    ServerName triviality.local
    
    # Proxy para el frontend en modo desarrollo
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Proxy para el backend
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    # WebSocket para Hot Module Replacement
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*)           ws://localhost:3000/$1 [P,L]
    
    # Logs
    ErrorLog ${APACHE_LOG_DIR}/triviality-error.log
    CustomLog ${APACHE_LOG_DIR}/triviality-access.log combined
</VirtualHost>
```

#### Configuración para Producción
```apache
<VirtualHost *:80>
    ServerName triviality.local
    DocumentRoot /var/www/html/triviality-project/frontend/build

    # Configuración del frontend
    <Directory /var/www/html/triviality-project/frontend/build>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Proxy para el backend
    ProxyPass /api http://localhost:8000/api
    ProxyPassReverse /api http://localhost:8000/api

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/triviality-error.log
    CustomLog ${APACHE_LOG_DIR}/triviality-access.log combined
</VirtualHost>
```

```bash
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

## Flujo de Trabajo

### Desarrollo
1. Inicia el servidor Laravel: `cd backend && php artisan serve`
2. Inicia el servidor React: `cd frontend && npm start`
3. Accede a http://triviality.local
   - Los cambios se actualizarán automáticamente (hot reload)
   - No necesitas ejecutar `npm run build` para ver los cambios

### Producción
1. Compila el frontend: `cd frontend && npm run build`
2. Actualiza la configuración de Apache para producción
3. Reinicia Apache: `sudo systemctl restart apache2`

## Solución de Problemas

### Error "Missing script: dev"
El proyecto usa `npm start` en lugar de `npm run dev` para el servidor de desarrollo.

### Cambios no visibles en desarrollo
Verifica que:
- Servidor Laravel está corriendo (`php artisan serve`)
- Servidor React está corriendo (`npm start`)
- Apache está configurado correctamente
- Estás accediendo a http://triviality.local

## Tecnologías Utilizadas

- **Backend**: Laravel, PHP, MySQL
- **Frontend**: React, TypeScript, Axios
- **Servidor**: Apache

## Verificar Instalación

1. Backend: http://localhost:8000/api/ejemplo
2. Frontend: http://triviality.local

## Endpoints de la API

- GET `/api/ejemplo`: Obtiene datos de ejemplo
- POST `/api/ejemplo`: Envía datos de ejemplo

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



