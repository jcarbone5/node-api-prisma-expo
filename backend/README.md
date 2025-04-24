# API de Autenticación con Node.js, Express, TypeScript y Prisma

API REST que proporciona autenticación de usuarios con JWT, refresh tokens y base de datos MySQL.

## Características

- Registro de usuarios
- Inicio de sesión
- Refresh token
- Validación de datos con Zod
- TypeScript
- Prisma ORM
- MySQL

## Requisitos Previos

- Node.js >= 14
- MySQL
- npm o yarn

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` con las siguientes variables:
   ```
   DATABASE_URL="mysql://usuario:contraseña@localhost:3306/nombre_db"
   JWT_SECRET="tu_super_secreto_seguro"
   JWT_REFRESH_SECRET="otro_super_secreto_seguro_diferente"
   PORT=3000
   ```
4. Sincroniza la base de datos:
   ```bash
   npx prisma db push
   ```

## Desarrollo

Para ejecutar en modo desarrollo:
```bash
npm run dev
```

## Producción

Para compilar y ejecutar en producción:
```bash
npm run build
npm start
```

## Endpoints

### POST /api/auth/register
Registra un nuevo usuario.
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Juan",
  "lastName": "Pérez",
  "birthDate": "1990-01-01"
}
```

### POST /api/auth/login
Inicia sesión y devuelve tokens.
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

### POST /api/auth/refresh-token
Obtiene un nuevo access token.
```json
{
  "refreshToken": "token_refresh"
}
```

## Estructura del Proyecto

```
src/
  ├── @types/         # Definiciones de tipos
  ├── controllers/    # Controladores
  ├── middlewares/    # Middlewares
  ├── routes/         # Rutas
  ├── schemas/        # Esquemas de validación
  ├── services/       # Lógica de negocio
  └── server.ts       # Punto de entrada
``` 