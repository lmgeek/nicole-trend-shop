# Nicole Trend Shop

E-commerce Next.js con MongoDB.

## Deploy en Dokploy

### 1. Conectar repositorio

En Dokploy, crea un nuevo proyecto y conecta el repositorio de GitHub.

### 2. Configurar Docker Compose

Dokploy detecta automáticamente el archivo `docker-compose.yml`. Asegúrate de que el **Build Type** esté en `docker-compose`.

No necesita Dockerfile adicional — el compose construye la app desde el Dockerfile incluido.

### 3. Configurar variables de entorno

En la sección **Environment** de Dokploy, agrega:

| Variable | Valor | Obligatorio |
|----------|-------|-------------|
| `JWT_SECRET` | `4oQSjsEL3StILUxjxettkM9drzklb7F86DKqaDPwrqwGnpoCxxnhgji/NkDNChZe` | Sí |
| `APP_PORT` | `3000` | No (default) |
| `MONGO_EXPRESS_PORT` | `8081` | No (default) |
| `MONGO_EXPRESS_USER` | `admin` | No (default) |
| `MONGO_EXPRESS_PASS` | `admin` | No (default) |

> **Importante:** Cambia `MONGO_EXPRESS_USER` y `MONGO_EXPRESS_PASS` si expones Mongo Express al público.

### 4. Primer deploy

Dokploy construye las imágenes e inicia los servicios en este orden:

1. `mongodb` — base de datos
2. `mongo-express` — interfaz web de administración (opcional)
3. `app` — aplicación Next.js

En el primer inicio, `app` ejecuta automáticamente las migraciones:
- Crea colección `_migrations` para trackear migraciones ejecutadas
- Ejecuta `001-initial-data.js` (admin, categorías, productos, etc.)
- Solo se ejecuta una vez; migraciones futuras se agregan como `002-*.js`

### 5. Verificar deploy

Accede a:

- **App:** `http://<tu-dominio>:3000`
- **Admin:** `http://<tu-dominio>:3000/admin/login`
  - Email: `admin@nicoletrend.com`
  - Password: `Nicol3123!Admin`
- **Mongo Express:** `http://<tu-dominio>:8081` (con basic auth configurado arriba)

### 6. Health check

La app expone `GET /api/health` que responde `{ "status": "ok" }`. Dokploy usa este endpoint para monitorear el contenedor.

### 7. Persistencia de datos

MongoDB guarda los datos en el volumen `mongodb_data`. Los datos persisten entre redeploys.

---

## Agregar migraciones futuras

Crea un archivo en `migrations/` con el formato `NNN-descripcion.js`:

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
