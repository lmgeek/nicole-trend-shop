# Nicole SRL - Backend API

API REST para Nicole Trend Shop.

## Desarrollo

```bash
cp .env.example .env
npm install
npm run dev
```

## Producción (Docker)

```bash
docker build -t nicole-server .
docker run -d -p 3001:3001 \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nicole \
  -e JWT_SECRET=tu-clave-secreta \
  --name nicole-server \
  nicole-server
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGODB_URI` | Connection string MongoDB | `mongodb+srv://...` |
| `JWT_SECRET` | Clave para tokens JWT | `clave-secreta` |
| `PORT` | Puerto del servidor | `3001` |

## Rutas

### Públicas
- `GET /api/health` - Health check
- `GET /api/categories` - Categorías
- `GET /api/categories/enabled` - Categorías habilitadas
- `GET /api/public/products` - Productos públicos
- `GET /api/public/products/featured` - Productos destacados
- `GET /api/public/hero-slides` - Hero slides habilitados

### Auth
- `POST /api/auth/login` - Login admin

### Admin (requiere token)
- `GET/POST/PUT/DELETE /api/products` - Productos
- `GET/POST/PUT/DELETE /api/clients` - Clientes
- `GET/POST/PUT/DELETE /api/sales` - Ventas
- `GET /api/users` - Usuarios
- `GET/POST/PUT/DELETE /api/categories` - Categorías
- `GET/POST/PUT/DELETE /api/hero-slides` - Hero slides
