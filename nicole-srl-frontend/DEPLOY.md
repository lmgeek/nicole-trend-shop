# Deploy en Portainer

## Opción 1: Application desde Git (recomendado)

1. Portainer → **Applications** → **Add application** → **Git Repository**
2. Repository URL: tu repo del frontend
3. Branch: `main`
4. **Dockerfile**: `Dockerfile`
5. **Build args**:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL del backend | `http://TU_DOMINIO:3001` |

6. **Publish port**: `80`
7. ✅ **Activate webhooks** → copia la URL
8. **Deploy the application**

## Opción 2: Build manual

```bash
docker build --build-arg VITE_API_URL=http://TU_DOMINIO:3001 -t nicole-frontend .
docker run -d -p 80:80 --name nicole-frontend nicole-frontend
```

## Webhook en GitHub

GitHub → Settings → Webhooks → Add webhook:
- Payload URL: URL del webhook de Portainer
- Content type: `application/json`
- Events: Just the push event

## Verificar deploy

```bash
curl http://TU_DOMINIO
# Debe devolver el HTML del frontend
```
