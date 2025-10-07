# Guía de Configuración de Supabase

## Base de Datos Creada ✅

La base de datos ha sido configurada exitosamente con las siguientes tablas:

### 1. **profiles** - Perfiles de usuario
- Almacena información adicional de los usuarios
- Campos: `name`, `business_name`, `logo`, `cover_photo`, `description`, `phone`, `address`, `facebook`, `instagram`, `twitter`

### 2. **user_roles** - Roles de usuario (separado por seguridad)
- Roles disponibles: `admin`, `creator`
- Los usuarios nuevos se crean automáticamente como `creator`
- Solo los administradores pueden modificar roles

### 3. **games** - Juegos/Productos
- Campos: `title`, `description`, `category`, `price`, `status`, `featured`
- Estados posibles: `pending`, `approved`, `rejected`

### 4. **game_images** - Imágenes de juegos
- Relacionadas con `games`
- Campos: `image_url`, `is_primary`

### 5. **whatsapp_analytics** - Analíticas de WhatsApp
- Registra cada clic en "Contactar por WhatsApp"

## Pasos para Verificar la Conexión

### 1. **Verificar que la autenticación funciona**

1. Ve a la página de registro: `/register`
2. Crea una nueva cuenta con:
   - Nombre del estudio
   - Tu nombre
   - Email
   - Contraseña
3. Deberías ser redirigido automáticamente al dashboard
4. La autenticación está configurada con **auto-confirmación de email** para facilitar las pruebas

### 2. **Verificar el Registro de Datos**

Puedes verificar que los datos se están guardando correctamente:

<lov-actions>
<lov-open-backend>Ver Base de Datos</lov-open-backend>
</lov-actions>

En el backend podrás:
- Ver las tablas creadas
- Inspeccionar los registros
- Ver los perfiles de usuario
- Verificar los roles asignados

### 3. **Verificar RLS (Row Level Security)**

Las políticas de seguridad configuradas incluyen:

#### Profiles
- ✅ Todos pueden ver perfiles
- ✅ Los usuarios solo pueden actualizar su propio perfil

#### Games
- ✅ Todos pueden ver juegos aprobados
- ✅ Los creadores pueden crear/editar/eliminar sus propios juegos
- ✅ Los administradores pueden aprobar/rechazar cualquier juego

#### User Roles
- ✅ Los usuarios solo pueden ver su propio rol
- ✅ Solo los administradores pueden modificar roles

### 4. **Crear un Usuario Administrador**

Para crear tu primer administrador, después de registrarte:

1. Abre el backend usando el botón de arriba
2. Ve a la tabla `user_roles`
3. Busca tu usuario (por `user_id`)
4. Cambia el valor de `role` de `creator` a `admin`

### 5. **Probar Operaciones CRUD**

#### Crear un juego:
```typescript
import { createGame } from '@/lib/supabase-games';

await createGame({
  title: "Mi Juego",
  description: "Descripción del juego",
  category: "Aventura",
  price: 50,
  user_id: "tu-user-id"
});
```

#### Obtener todos los juegos:
```typescript
import { getAllGames } from '@/lib/supabase-games';

const games = await getAllGames();
console.log(games);
```

#### Actualizar perfil:
```typescript
import { updateProfile } from '@/lib/supabase-auth';

await updateProfile("tu-user-id", {
  description: "Mi nuevo estudio de juegos",
  phone: "+59177360690"
});
```

#### Registrar clic de WhatsApp:
```typescript
import { trackWhatsAppClick } from '@/lib/supabase-games';

await trackWhatsAppClick("user-id", "game-id-opcional");
```

### 6. **Verificar Analíticas**

Para ver las analíticas de WhatsApp, puedes ejecutar esta consulta en el backend:

```sql
SELECT 
  COUNT(*) as total_clicks,
  DATE(clicked_at) as date
FROM whatsapp_analytics
GROUP BY DATE(clicked_at)
ORDER BY date DESC;
```

## Archivos Creados

- `src/lib/supabase-auth.ts` - Funciones de autenticación y perfiles
- `src/lib/supabase-games.ts` - Funciones para gestionar juegos e imágenes

## Funcionalidades Implementadas

✅ Autenticación con email/contraseña
✅ Auto-confirmación de emails (para desarrollo)
✅ Creación automática de perfil al registrarse
✅ Asignación automática de rol "creator"
✅ Sistema de roles seguro (tabla separada)
✅ CRUD de juegos con imágenes
✅ Políticas de seguridad (RLS) configuradas
✅ Analíticas de WhatsApp
✅ Actualización automática de timestamps

## Próximos Pasos

1. ✅ Verifica que puedes registrarte e iniciar sesión
2. ✅ Crea tu primer administrador en la base de datos
3. ✅ Prueba crear un juego desde el dashboard
4. ✅ Verifica que las analíticas se registran correctamente
5. 📧 Configura Resend para notificaciones por email (opcional)

## Soporte

Si encuentras algún problema:
1. Abre el backend y verifica que las tablas existen
2. Revisa la consola del navegador para ver errores
3. Verifica que las políticas RLS no estén bloqueando operaciones legítimas
