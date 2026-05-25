# Nicole Trend Shop

E-commerce Next.js con MongoDB.

## Deploy en Dokploy

### 1. Crear proyecto en Dokploy

- **Build Type:** `nixpacks`
- **Repository:** conecta tu repositorio de GitHub
- **Branch:** `main`

Dokploy detecta automáticamente `nixpacks.toml` y construye la app.

### 2. Agregar MongoDB

En Dokploy, ve a la sección **Databases** de tu proyecto y agrega una base de datos **MongoDB**.

Esto crea un contenedor MongoDB accesible internamente como `mongodb` (mismo nombre del servicio). La app se conecta automáticamente a `mongodb://mongodb:27017/nicole-trend-shop`.

### 3. Variables de entorno

Configura estas variables en **Environment** de Dokploy:

| Variable | Valor | Obligatorio |
|----------|-------|-------------|
| `JWT_SECRET` | `4oQSjsEL3StILUxjxettkM9drzklb7F86DKqaDPwrqwGnpoCxxnhgji/NkDNChZe` | Sí |
| `NODE_ENV` | `production` | Sí |
| `MONGODB_URI` | `mongodb://mongodb:27017/nicole-trend-shop` | Sí |

### 4. Primer deploy

Dokploy construye e inicia los servicios. En el primer inicio:

1. El entrypoint espera a que MongoDB esté listo
2. Ejecuta las migraciones automáticas (`migrations/runner.js`)
3. Crea los datos iniciales (admin, categorías, productos, etc.)
4. Inicia Next.js en modo producción

### 5. Verificar

- **App:** `http://<tu-dominio>`
- **Admin:** `http://<tu-dominio>/admin/login`
  - Email: `admin@nicoletrend.com`
  - Password: `Nicol3123!Admin`

### 6. Mongo Express (opcional)

Para acceder a la base de datos desde el navegador, levanta localmente:

```bash
docker compose up -d
```

Accede en `http://localhost:8081` (usuario: `admin`, password: `admin`).

> En Dokploy, puedes agregar Mongo Express como otro servicio Nixpacks, o exponer el puerto de MongoDB desde la base de datos de Dokploy.

---

## Desarrollo local

```bash
# Iniciar MongoDB
docker compose up -d

# Copiar .env.example a .env.local y configurar
cp .env.example .env.local

# Instalar dependencias
npm install

# Ejecutar migraciones manualmente
node migrations/runner.js

# Iniciar dev
npm run dev
```

---

## Migraciones futuras

Crea un archivo en `migrations/` con formato `NNN-descripcion.js`:

```js
module.exports = {
  up: async (mongoose) => {
    const db = mongoose.connection.db;
    await db.collection('products').updateMany(
      { /* filter */ },
      { $set: { /* changes */ } }
    );
  },
};
```

En el próximo deploy se ejecutará automáticamente.
