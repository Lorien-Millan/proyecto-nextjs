---
name: supabase
description: >
  Use when doing ANY task involving Supabase in this project.
  Triggers: base de datos (producto, categoria, pedido, detalles_pedido),
  autenticación (login, registro, Google OAuth, sesiones, getUser),
  cliente SSR (@supabase/ssr, createBrowserClient, createServerClient),
  consultas (select, insert, eq, ilike, order), RLS, migraciones,
  API routes (route.ts), CarritoContext, o cualquier error de Supabase.
---

# Skill: Supabase — NerfThis Game Shop

## Contexto del proyecto

Este proyecto usa **@supabase/ssr** (no `@supabase/auth-helpers-nextjs`, aunque está en package.json es legacy).

### Clientes disponibles

```ts
// Para componentes del navegador ('use client')
import { createBrowserClient } from '@supabase/ssr';
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Para Server Components y API Routes
import { createServerClient } from '@/lib/supabase/server';
const supabase = createServerClient();
```

## Tablas de la base de datos

### `producto`
Campos relevantes: `id_producto`, `titulo`, `descripcion`, `precio`, `precio_original`,
`stock`, `imagen`, `imagen2`, `plataforma`, `desarrollador`, `calificacion_pegi`,
`fecha_lanzamiento`, `id_categoria`.

Relación: `categoria:categoria(nombre)` — join con la tabla `categoria`.

### `categoria`
Campos: `id_categoria`, `nombre`, `descripcion`, `imagen`.
Los nombres en BD están sin tildes (ej: `accion`, `simulacion`).
Usar `CATEGORY_NAME_MAP` para mostrarlos formateados.

### `pedido`
Campos: `id_pedido`, `id_usuario`, `total_pagar`, `estado` (pendiente/completado), `fecha`.

### `detalles_pedido`
Campos: `id_pedido`, `id_producto`, `precio_compra`.
No tiene columna `cantidad` — se inserta una fila por producto.

## Patrones de consulta habituales

```ts
// Listar productos con categoría
const { data } = await supabase
  .from('producto')
  .select('*, categoria:categoria(nombre)')
  .order('id_producto', { ascending: false });

// Producto por ID
const { data } = await supabase
  .from('producto')
  .select('*, categoria:categoria(nombre)')
  .eq('id_producto', parseInt(id))
  .limit(1);

// Búsqueda por texto
const { data } = await supabase
  .from('producto')
  .select('...')
  .or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%,plataforma.ilike.%${q}%`)
  .limit(20);

// Insertar pedido
const { data: pedido } = await supabase
  .from('pedido')
  .insert({ id_usuario: 1, total_pagar: total, estado: 'pendiente', fecha: new Date().toISOString() })
  .select('id_pedido')
  .single();
```

## Autenticación

```ts
// Login con email/contraseña
await supabase.auth.signInWithPassword({ email, password });

// Login con Google OAuth
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/` }
});

// Obtener usuario actual
const { data } = await supabase.auth.getUser();
const user = data.user; // null si no autenticado

// Cerrar sesión
await supabase.auth.signOut();
```

## Errores comunes y soluciones

| Error | Causa | Solución |
|---|---|---|
| `createServerClient is not a function` | Importando del paquete incorrecto | Importar de `@/lib/supabase/server` |
| `Row not found` con `.single()` | No hay filas que coincidan | Usar `.limit(1)` + acceder a `[0]` |
| Carrito vacío tras login | `localStorage` usa clave `carrito_guest` | El contexto cambia la clave automáticamente en `onAuthStateChange` |
| Google OAuth no redirige | `redirectTo` incorrecto | Verificar `NEXT_PUBLIC_SITE_URL` en `.env.local` |

## MCP disponible

Con el MCP de Supabase conectado puedes consultar la BD directamente:
- `execute_sql` — ejecutar cualquier query SQL
- `list_tables` — ver todas las tablas
- `get_logs` — ver logs de Postgres o de la API

Autentica con: `claude /mcp` → seleccionar "supabase" → "Authenticate"
