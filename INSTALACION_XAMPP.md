# Guía de Instalación para XAMPP

## Requisitos Previos
- XAMPP instalado (descarga desde https://www.apachefriends.org/)
- Navegador web moderno

## Pasos de Instalación

### 1. Instalar XAMPP
1. Descarga XAMPP desde https://www.apachefriends.org/
2. Ejecuta el instalador y sigue las instrucciones
3. Instala en la ruta por defecto: `C:\xampp` (Windows) o `/Applications/XAMPP` (Mac)

### 2. Copiar Archivos del Proyecto
1. Copia todo el proyecto a la carpeta `htdocs` de XAMPP:
   - Windows: `C:\xampp\htdocs\blvgames\`
   - Mac: `/Applications/XAMPP/htdocs/blvgames/`
   - Linux: `/opt/lampp/htdocs/blvgames/`

### 3. Configurar la Base de Datos

1. Inicia XAMPP Control Panel
2. Inicia los servicios de Apache y MySQL
3. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
4. Haz clic en "Nueva" (New) en el panel izquierdo
5. Importa el archivo de base de datos:
   - Haz clic en la pestaña "Importar"
   - Selecciona el archivo `api/database.sql`
   - Haz clic en "Continuar"

Alternativamente, puedes ejecutar el archivo SQL directamente:
1. En phpMyAdmin, haz clic en la pestaña "SQL"
2. Copia y pega todo el contenido del archivo `api/database.sql`
3. Haz clic en "Continuar"

### 4. Verificar la Configuración

1. Asegúrate de que los servicios de Apache y MySQL estén en verde en XAMPP Control Panel
2. Verifica que la API funcione visitando:
   - `http://localhost/blvgames/api/users.php`
   - Deberías ver una respuesta JSON con los usuarios de ejemplo

### 5. Configurar el Frontend

El proyecto ya está configurado para conectarse a `http://localhost/blvgames/api`. 

Si necesitas cambiar la URL de la API:
1. Abre el archivo `src/lib/api.ts`
2. Modifica la constante `API_URL` según tu configuración

### 6. Ejecutar el Proyecto

1. Asegúrate de tener Node.js instalado
2. Abre una terminal en la carpeta del proyecto
3. Ejecuta:
   ```bash
   npm install
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173` (o la URL que te indique Vite)

## Credenciales por Defecto

### Administrador
- Email: `admin@blvgames.bo`
- Password: `password` (hash: bcrypt)

### Usuarios de Ejemplo
- Email: `carlos@example.com` / Password: `password`
- Email: `maria@example.com` / Password: `password`
- Email: `jorge@example.com` / Password: `password`
- Email: `ana@example.com` / Password: `password`

## Solución de Problemas

### Error de Conexión a la Base de Datos
- Verifica que MySQL esté corriendo en XAMPP Control Panel
- Comprueba que el puerto 3306 no esté siendo usado por otro programa
- Revisa las credenciales en `api/config.php`

### Error CORS
- Asegúrate de que Apache esté corriendo
- Verifica que los headers CORS estén configurados en `api/config.php`

### No se cargan los datos
- Verifica que la URL de la API en `src/lib/api.ts` sea correcta
- Comprueba que la base de datos esté creada e importada correctamente
- Revisa la consola del navegador para ver errores específicos

### Puerto ocupado
Si el puerto 80 está ocupado:
1. Abre XAMPP Control Panel
2. Haz clic en "Config" junto a Apache
3. Selecciona `httpd.conf`
4. Busca `Listen 80` y cámbialo a otro puerto (ej: `Listen 8080`)
5. Actualiza la URL en `src/lib/api.ts` con el nuevo puerto

## Notas Importantes

- El proyecto usa localStorage para mantener la sesión del usuario
- Todos los enlaces de WhatsApp usan el número fijo: `https://wa.me/59177360690?text=Hola`
- Los clicks de WhatsApp se registran en la tabla `whatsapp_analytics`
- Las contraseñas se almacenan hasheadas con bcrypt

## Estructura de la API

```
api/
├── config.php          # Configuración de BD y funciones helper
├── auth.php           # Login y registro
├── users.php          # CRUD de usuarios
├── games.php          # CRUD de juegos
├── analytics.php      # Tracking de WhatsApp
└── database.sql       # Script de creación de BD
```

## Soporte

Para problemas o preguntas, contacta al equipo de desarrollo.
