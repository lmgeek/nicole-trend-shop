# Deploy en Portainer

## Opción 1: Application desde Git (recomendado)

1. Portainer → **Applications** → **Add application** → **Git Repository**
2. Repository URL: tu repo del backend
3. Branch: `main`
4. **Dockerfile**: `Dockerfile`
5. **Environment variables**:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `MONGODB_URI` | Connection string MongoDB | `mongodb+srv://user:pass@cluster.mongodb.net/nicole` |
| `JWT_SECRET` | Clave para tokens JWT | `clave-larga-aleatoria` |
| `PORT` | Puerto del servidor | `3001` |

6. **Publish port**: `3001`
7. ✅ **Activate webhooks** → copia la URL
8. **Deploy the application**

## Opción 2: Build manual

```bash
docker build -t nicole-server .
docker run -d -p 3001:3001 \
  -e MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nicole \
  -e JWT_SECRET=tu-clave-secreta \
  --name nicole-server \
  nicole-server
```

## Webhook en GitHub

GitHub → Settings → Webhooks → Add webhook:
- Payload URL: URL del webhook de Portainer
- Content type: `application/json`
- Events: Just the push event

## MongoDB

MongoDB se ejecuta **fuera** del contenedor:

**MongoDB Atlas** (recomendado):
- Configura `MONGODB_URI` con tu connection string

**Contenedor separado**:
```bash
docker run -d --name nicole-mongo \
  -p 27017:27017 \
  -v mongo-data:/data/db \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=tu-password \
  --restart unless-stopped \
  mongo:7.0
```

## Verificar deploy

```bash
curl http://TU_DOMINIO:3001/api/health
# {"status":"ok"}
```
