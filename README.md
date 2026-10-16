# Libros API

Backend REST simple para la gestión de libros desarrollado con **NestJS** y **Prisma 7** (PostgreSQL con `@prisma/adapter-pg`).

---

## 1. Instalación y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor (escucha en el puerto 3000)
npm start
```

> **Nota:** Por defecto, el proyecto inicia con `USE_DB=false` utilizando persistencia en memoria con los 3 libros iniciales y `siguienteId = 4`. Funciona directamente sin base de datos ni migraciones previas.

---

## 2. Endpoints Disponibles (`/libros`)

- **GET /libros**: Lista todos los libros (filtro opcional por query param `?autor=`).
- **GET /libros/:id**: Obtiene el libro por ID (404 si no existe).
- **POST /libros**: Crea un nuevo libro (retorna 201 y cabecera `Location: /libros/{id}`).
- **PUT /libros/:id**: Reemplaza el libro completo (404 si no existe).
- **PATCH /libros/:id**: Actualiza los campos enviados (404 si no existe).
- **DELETE /libros/:id**: Elimina el libro (retorna 204 sin cuerpo, 404 si no existe).

---

## 3. Pasos para Activar la Base de Datos Real

Cuando desees conectar tu base de datos PostgreSQL real y ejecutar la migración, sigue estos 3 pasos:

1. **Configurar las variables en `.env`**:
   ```env
   USE_DB=true
   DATABASE_URL="postgresql://usuario:contraseña@host:5432/nombre_bd?schema=public"
   ```

2. **Crear y ejecutar la migración con Prisma**:
   ```bash
   npx prisma migrate dev --name init
   ```
   *(Esto creará los archivos SQL dentro de la carpeta `prisma/migrations` y aplicará las tablas en tu base de datos).*

3. **Iniciar el servidor conectado a la base de datos**:
   ```bash
   npm start
   ```
