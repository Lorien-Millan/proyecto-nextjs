# CLAUDE.md — NerfThis Game Shop

Fichero de contexto para Claude Code. Léelo al inicio de cada sesión para entender el proyecto antes de tocar cualquier código.

---

## ¿Qué es este proyecto?

**NerfThis Game Shop** es una tienda online de videojuegos construida con:

- **Next.js 16** (App Router, TypeScript)
- **Supabase** como base de datos y sistema de autenticación
- **Tailwind CSS v4** para estilos
- **React 19**

---

## Estructura de carpetas

```
proyecto/
├── app/
│   ├── (auth)/              # Rutas de autenticación (sin navbar propio)
│   │   ├── login/           # Inicio de sesión (email/pass + Google OAuth)
│   │   └── registro/        # Registro de nuevos usuarios
│   ├── (tienda)/            # Rutas principales de la tienda
│   │   ├── carrito/         # Carrito de compra y finalizar pedido
│   │   ├── category/[id]/   # Productos filtrados por categoría
│   │   ├── juegos/          # Catálogo completo de juegos
│   │   ├── product/[id]/    # Detalle de producto individual
│   │   └── search/          # Buscador de juegos
│   ├── api/
│   │   ├── pedido/crear/    # POST — crea pedido + detalles_pedido en BD
│   │   └── producto/verificar/ # GET — verifica stock de un producto por ?id=
│   ├── layout.tsx           # Layout raíz: fuentes, CarritoProvider, Navbar
│   └── page.tsx             # Página de inicio (home)
├── components/
│   ├── GridCategorias.tsx   # Grid de categorías en la home
│   ├── Navbar.tsx           # Barra de navegación con carrito y auth
│   ├── ProductCard.tsx      # Tarjeta reutilizable de producto
│   └── TopVentas.tsx        # Sección de productos destacados
├── contexts/
│   └── CarritoContext.tsx   # Estado global del carrito (localStorage por userId)
├── lib/
│   └── supabase/
│       ├── client.ts        # Cliente Supabase para el navegador (use client)
│       └── server.ts        # Cliente Supabase para el servidor (RSC / API routes)
└── .env.local               # Variables de entorno (NO subir a git)
```

---

## Base de datos (Supabase)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `producto` | Juegos: id_producto, titulo, descripcion, precio, precio_original, stock, imagen, imagen2, plataforma, desarrollador, calificacion_pegi, fecha_lanzamiento, id_categoria |
| `categoria` | Categorías: id_categoria, nombre, descripcion, imagen |
| `pedido` | Cabecera de pedido: id_pedido, id_usuario, total_pagar, estado, fecha |
| `detalles_pedido` | Líneas del pedido: id_pedido, id_producto, precio_compra |

### Conexión a la BD

Siempre usar las funciones de `lib/supabase/`:

```ts
// En componentes o páginas con 'use client'
import { createClientComponentClient } from '@/lib/supabase/client';

// En Server Components (RSC) o API Routes (route.ts)
import { createServerClient } from '@/lib/supabase/server';
```

Las credenciales están en `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Autenticación

- Gestionada por **Supabase Auth**.
- Login con email/contraseña: `supabase.auth.signInWithPassword()`
- Login con Google (OAuth): `supabase.auth.signInWithOAuth({ provider: 'google' })`
- El proveedor Google está configurado en el panel de Supabase (no en el código).
- El carrito persiste en `localStorage` con clave `carrito_<userId>` (o `carrito_guest` para no autenticados). Al hacer login/logout cambia automáticamente al carrito del usuario correspondiente.

---

## API Routes

### `POST /api/pedido/crear`
Crea un pedido en la BD. Espera en el body:
```json
{ "userId": "...", "items": [{ "id_producto": 1, "precio": 29.99 }], "total": 29.99 }
```

### `GET /api/producto/verificar?id=5`
Devuelve datos y disponibilidad de un producto:
```json
{ "id": 5, "titulo": "...", "stock": 3, "precio": 29.99, "disponible": true }
```

---

## MCP — Supabase

Este proyecto tiene el MCP de Supabase conectado. Puedes usarlo para:
- Consultar tablas directamente: `list_tables`, `execute_sql`
- Ver migraciones: `list_migrations`
- Depurar: `get_logs`

Configuración en `.mcp.json` (raíz del proyecto):
```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp"
    }
  }
}
```

Para autenticarte: ejecuta `claude /mcp` en la terminal, selecciona "supabase" y pulsa "Authenticate".

---

## Skills instaladas

### `supabase` (de supabase/agent-skills)
Instalada con: `npx skills add supabase/agent-skills --skill supabase`

Úsala para cualquier tarea relacionada con Supabase: Auth, base de datos, RLS, migraciones, cliente SSR, Edge Functions, etc.

---

## Comandos útiles

```bash
npm run dev      # Servidor de desarrollo en localhost:3000
npm run build    # Build de producción
npm run lint     # Linter ESLint
```

---

## Convenciones del proyecto

- Las páginas con hooks o interactividad llevan `'use client'` al inicio.
- Las páginas que solo leen datos (sin interacción) son Server Components y usan `createServerClient()`.
- Los nombres de categoría se normalizan con `CATEGORY_NAME_MAP` (Acción, Simulación, etc.) porque en BD están sin tildes.
- Los precios se muestran con `.toFixed(2)` + `€`.
- El color principal de la marca es `var(--color-rosa-principal)`.
