# LinkCloud frontend

Interfaz React + TypeScript para crear enlaces cortos con la API de LinkCloud.

## Ejecutar en desarrollo

1. Copia .env.example como .env.
2. Ajusta VITE_API_BASE_URL con la dirección actual del backend.
3. Instala dependencias con npm install y ejecuta con npm run dev.

El frontend envía POST /shorten con original_url y muestra el enlace devuelto. La API debe permitir en CORS el origen local, normalmente http://localhost:5173.

## Crear archivos estáticos

Ejecuta npm run build. Vite genera los archivos listos para publicar en dist/. VITE_API_BASE_URL queda incorporada durante la compilación.
