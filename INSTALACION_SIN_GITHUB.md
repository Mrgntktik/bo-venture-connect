# Guía de Instalación y Uso sin GitHub

## Ejecución Local del Proyecto

### Requisitos Previos
- Node.js (versión 16 o superior)
- npm o bun instalado
- Navegador web moderno

### Pasos para Ejecutar Localmente

1. **Desde Lovable Editor:**
   - El proyecto ya está listo para ejecutarse
   - Haz clic en el botón de vista previa para ver la aplicación
   - Los cambios se reflejan automáticamente

2. **Descargar el Proyecto:**
   - En Lovable, ve a Settings → Export Project
   - Descarga el archivo ZIP del proyecto
   - Extrae el contenido en una carpeta local

3. **Instalar Dependencias:**
   ```bash
   cd [nombre-de-la-carpeta]
   npm install
   ```

4. **Configurar Variables de Entorno:**
   - El archivo `.env` ya está configurado automáticamente por Lovable Cloud
   - Contiene las credenciales de Supabase necesarias
   - **No necesitas modificar nada**

5. **Ejecutar el Proyecto:**
   ```bash
   npm run dev
   ```
   - La aplicación se abrirá en `http://localhost:5173`

## Despliegue sin GitHub

### Opción 1: Desplegar desde Lovable (Recomendado)

1. **Publicación Directa:**
   - Haz clic en el botón "Publish" en la esquina superior derecha de Lovable
   - Tu aplicación se desplegará automáticamente en un dominio de Lovable
   - Recibirás una URL como: `tu-proyecto.lovable.app`
   - **No requiere GitHub ni configuración adicional**

2. **Dominio Personalizado:**
   - Ve a Project → Settings → Domains en Lovable
   - Conecta tu dominio personalizado
   - Sigue las instrucciones para configurar los registros DNS
   - *Requiere plan pago de Lovable*

### Opción 2: Desplegar Manualmente en Netlify

1. **Preparar el Build:**
   ```bash
   npm run build
   ```
   - Esto genera una carpeta `dist` con los archivos estáticos

2. **Desplegar en Netlify:**
   - Ve a [netlify.com](https://netlify.com) y crea una cuenta
   - Arrastra y suelta la carpeta `dist` en el área de despliegue
   - Tu sitio estará en línea en minutos
   - **No requiere GitHub**

3. **Configurar Variables de Entorno en Netlify:**
   - Ve a Site settings → Environment variables
   - Agrega las siguientes variables del archivo `.env`:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

### Opción 3: Desplegar Manualmente en Vercel

1. **Instalar Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Desplegar:**
   ```bash
   vercel
   ```
   - Sigue las instrucciones en la terminal
   - El CLI subirá tu proyecto directamente
   - **No requiere GitHub**

3. **Variables de Entorno:**
   - Durante el despliegue, Vercel te preguntará por las variables
   - Cópialas del archivo `.env`

### Opción 4: Hosting Tradicional (Compartido)

1. **Construir el Proyecto:**
   ```bash
   npm run build
   ```

2. **Subir Archivos:**
   - Sube todo el contenido de la carpeta `dist` a tu hosting
   - Usa FTP, cPanel File Manager, o el método que proporcione tu hosting
   - Apunta el dominio a la carpeta donde subiste los archivos

3. **Configuración de Redireccionamiento:**
   - Crea un archivo `.htaccess` en la raíz con:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## Backend (Lovable Cloud/Supabase)

### No Requiere Configuración Adicional
- El backend ya está configurado y desplegado automáticamente
- Lovable Cloud/Supabase se encarga de:
  - Base de datos PostgreSQL
  - Autenticación de usuarios
  - Almacenamiento de archivos
  - API REST automática
  - Funciones serverless

### Acceder al Backend
- Desde Lovable, haz clic en el botón para ver el backend
- Allí puedes:
  - Ver y editar datos de tablas
  - Gestionar usuarios
  - Revisar logs
  - Configurar políticas de seguridad

## Estructura del Proyecto Desplegado

```
proyecto/
├── dist/                    # Archivos de producción (después de build)
│   ├── assets/             # JS, CSS, imágenes optimizadas
│   └── index.html          # Punto de entrada
├── src/                    # Código fuente
├── supabase/              # Configuración del backend
└── .env                   # Variables de entorno (automático)
```

## Credenciales de Acceso

### Usuario Administrador
Una vez desplegado, crea un usuario administrador:

1. Registra una cuenta desde `/register`
2. Ve al backend de Lovable Cloud
3. En la tabla `user_roles`, agrega un registro:
   - `user_id`: el ID del usuario registrado
   - `role`: `admin`

### Usuarios de Prueba
- Puedes crear usuarios adicionales desde la interfaz de registro
- Por defecto, todos son `creator`
- Solo los admin tienen acceso al panel de administración

## Ventajas de Desplegar sin GitHub

✅ **Más Simple:** No necesitas aprender Git ni GitHub  
✅ **Más Rápido:** Despliega directamente desde Lovable  
✅ **Menos Pasos:** Menos configuración y herramientas  
✅ **Control Total:** Puedes descargar y mover tu proyecto cuando quieras

## Desventajas a Considerar

⚠️ **Sin Control de Versiones:** No hay historial automático de cambios  
⚠️ **Sin Colaboración:** Difícil trabajar en equipo  
⚠️ **Sin CI/CD:** Los despliegues son manuales  
⚠️ **Menos Backups:** Debes hacer copias de seguridad manualmente

## Recomendaciones

### Para Proyectos Pequeños/Personales
- Usa el botón "Publish" de Lovable → **Más fácil**
- O descarga y sube manualmente a Netlify → **Más control**

### Para Proyectos Medianos
- Considera usar GitHub para tener historial de cambios
- Pero si prefieres sin GitHub, usa Netlify Drop (arrastra y suelta)

### Para Proyectos Profesionales
- Se recomienda usar GitHub para mejor control
- Pero puedes comenzar sin él y agregar Git después

## Solución de Problemas

### La aplicación no carga después del despliegue
- Verifica que las variables de entorno estén configuradas
- Revisa que el archivo `.htaccess` o `_redirects` esté presente
- Comprueba la consola del navegador para ver errores

### Error de conexión con el backend
- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctas
- Asegúrate de que las variables comiencen con `VITE_`
- Reconstruye el proyecto después de cambiar variables

### Los estilos no se cargan
- Verifica que la ruta base sea correcta en `vite.config.ts`
- Asegúrate de que todos los archivos de `dist` se hayan subido
- Revisa que el servidor soporte archivos estáticos

## Actualizaciones del Proyecto

### Para actualizar la aplicación desplegada:

1. **Desde Lovable:**
   - Haz los cambios necesarios
   - Haz clic en "Publish" nuevamente
   - Los cambios se despliegan automáticamente

2. **Despliegue Manual:**
   - Descarga la nueva versión del proyecto
   - Ejecuta `npm install` y `npm run build`
   - Sube la nueva carpeta `dist` al hosting
   - Reemplaza los archivos anteriores

## Respaldo y Seguridad

### Hacer Backups Regulares
```bash
# Descargar el proyecto desde Lovable
# Settings → Export Project

# O copiar la carpeta completa
cp -r mi-proyecto mi-proyecto-backup-$(date +%Y%m%d)
```

### Proteger las Variables de Entorno
- Nunca compartas tu archivo `.env`
- No subas `.env` a repositorios públicos
- Usa variables de entorno del hosting para producción

## Soporte

Para problemas o preguntas:
- Revisa la documentación de Lovable: [docs.lovable.dev](https://docs.lovable.dev)
- Consulta el archivo `SUPABASE_SETUP.md` para configuración del backend
- Revisa la consola del navegador para errores específicos
