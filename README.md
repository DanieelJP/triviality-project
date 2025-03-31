# Triviality Project

## Descripción
Triviality es un juego de preguntas y respuestas basado en la API Open Trivia Database. El proyecto utiliza Laravel para el backend y React para el frontend.

## Requisitos Previos

Asegúrate de tener instalados los siguientes requisitos antes de continuar:

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
mysql -u laraveluser -p -e "CREATE DATABASE triviality;"

# Migrar base de datos
php artisan migrate

# Iniciar servidor Laravel
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

## Flujo de Trabajo

### Desarrollo
1. Inicia el servidor Laravel:
   ```bash
   cd backend && php artisan serve
   ```
2. Inicia el servidor React:
   ```bash
   cd frontend && npm start
   ```


### Producción
1. Compila el frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Configura Apache para servir la aplicación en producción.
3. Reinicia Apache:
   ```bash
   sudo systemctl restart apache2
   ```

## Solución de Problemas

### Error "Missing script: dev"
El proyecto utiliza `npm start` en lugar de `npm run dev` para el servidor de desarrollo.

### Cambios no visibles en desarrollo
Verifica que:
- El servidor Laravel esté corriendo (`php artisan serve`).
- El servidor React esté corriendo (`npm start`).
- Apache esté configurado correctamente.

### Problemas con permisos
Si experimentas problemas con permisos en la carpeta del proyecto:

```bash
sudo chown -R $USER:www-data /var/www/html/triviality-project
sudo chmod -R 775 /var/www/html/triviality-project
```

### Apache no se reinicia
Para verificar errores en Apache:

```bash
sudo systemctl status apache2
sudo tail -f /var/log/apache2/error.log
```

## Tecnologías Utilizadas

- **Backend**: Laravel, PHP, MySQL
- **Frontend**: React, TypeScript, Axios
- **Servidor**: Apache

## Verificar Instalación

- **Backend**: [http://localhost:8000](http://localhost:8000)
- **Frontend**: [http://localhost:3000](http://localhost:3000)

## Endpoints de la API

- `GET /api/trivia/questions` - Obtiene preguntas de trivia.
- `GET /api/trivia/categories` - Obtiene las categorías de trivia.

