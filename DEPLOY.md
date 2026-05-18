# Deploy en Portainer - Nicole SRL Stack

## Arquitectura del Stack

```
                    ┌─────────────┐
  Puerto 80/443 ───►│   Nginx     │
                    │ (Reverse    │
                    │   Proxy)    │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
       /api/* │                    /*   │
              ▼                         ▼
        ┌──────────┐           ┌─────────────┐
        │  Server  │           │  Frontend   │
        │ (Node.js)│           │  (Vite+React│
        │  :3001   │           │   + Nginx)  │
        └────┬─────┘           └─────────────┘
             │
             │ mongodb://
             ▼
        ┌──────────┐
        │  MongoDB │
        │  :27017  │
        └──────────┘
```

## Estructura de archivos

```
nicole2/
├── docker-compose.yml          # Stack completo para Portainer
├── .env.example                # Variables de entorno
├── .env                        # Tu archivo de configuración (no commitear)
├── deploy/
│   ├── nginx/
│   │   ├── nginx.conf          # Config principal de Nginx
│   │   ├── conf.d/
│   │   │   └── default.conf    # Reverse proxy + frontend
│   │   └── ssl/                # Certificados TLS (opcional)
│   └── mongo/
│       ├── mongod.conf         # Config de MongoDB
│       └── init.js             # Script de inicializacion
├── nicole-srl-server/
│   ├── Dockerfile              # Multi-stage build
│   └── .dockerignore
└── nicole-srl-frontend/
    ├── Dockerfile              # Multi-stage build
    └── .dockerignore
```

## Opcion 1: Deploy via Web UI (recomendado)

### Paso 1: Preparar variables de entorno

1. Copiar `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Editar `.env` y cambiar **todos** los valores por defecto:
   ```bash
   nano .env
   ```

   **Variables obligatorias a cambiar:**
   - `MONGO_ROOT_PASSWORD` - Contraseña fuerte para admin de MongoDB
   - `MONGO_APP_PASSWORD` - Contraseña para la app de MongoDB
   - `JWT_SECRET` - Secreto JWT (minimo 32 caracteres)

### Paso 2: Crear el Stack en Portainer

1. Ir a **Portainer** → **Stacks** → **Add stack**
2. Nombre: `nicole-srl`
3. Metodo: **Web editor**
4. Copiar el contenido de `docker-compose.yml`
5. Seleccionar **Upload env file** y subir el archivo `.env`
6. Click en **Deploy the stack**

### Opcion 1b: Deploy via Git Repository

1. Ir a **Portainer** → **Stacks** → **Add stack**
2. Nombre: `nicole-srl`
3. Metodo: **Git Repository**
4. Repository URL: `https://github.com/tu-org/nicole2.git`
5. Branch: `main`
6. Base path: `/` (raiz del repo)
7. Variables de entorno: agregar cada variable del `.env` como variable individual
8. Click en **Deploy the stack**

## Opcion 2: Deploy via CLI

```bash
# 1. Preparar variables
cp .env.example .env
nano .env  # Editar valores

# 2. Deployar el stack
docker compose up -d --build

# 3. Verificar estado
docker compose ps

# 4. Ver logs
docker compose logs -f
```

## Configuracion SSL (opcional)

### Con Let's Encrypt (Certbot)

1. Generar certificados:
   ```bash
   certbot certonly --standalone -d tudominio.com
   ```

2. Copiar certificados al directorio SSL:
   ```bash
   cp /etc/letsencrypt/live/tudominio.com/fullchain.pem deploy/nginx/ssl/
   cp /etc/letsencrypt/live/tudominio.com/privkey.pem deploy/nginx/ssl/
   ```

3. Crear `deploy/nginx/conf.d/ssl.conf`:
   ```nginx
   server {
       listen 443 ssl http2;
       server_name tudominio.com;

       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;

       # ... mismo contenido que default.conf
   }

   server {
       listen 80;
       server_name tudominio.com;
       return 301 https://$host$request_uri;
   }
   ```

4. Redeployar el stack

## Verificacion del deploy

### Verificar servicios

```bash
docker compose ps
```

Todos los servicios deben estar `running` o `healthy`.

### Verificar MongoDB

```bash
docker exec -it nicole-mongo mongosh -u admin -p changeme_this_strong_password --eval "db.adminCommand('ping')"
```

### Verificar Backend

```bash
curl http://localhost/api/health
# Debe devolver: {"status":"ok"}
```

### Verificar Frontend

```bash
curl http://localhost/
# Debe devolver el HTML del frontend
```

## Logs

```bash
# Todos los logs
docker compose logs -f

# Solo backend
docker compose logs -f server

# Solo MongoDB
docker compose logs -f mongo

# Solo Nginx
docker compose logs -f nginx
```

## Actualizacion del stack

### Via Portainer UI

1. Ir a **Stacks** → `nicole-srl`
2. Editar el `docker-compose.yml` si es necesario
3. Click en **Update the stack** → **Rebuild**

### Via CLI

```bash
docker compose up -d --build
```

### Solo un servicio

```bash
docker compose up -d --build server
```

## Backup de MongoDB

```bash
# Backup
docker exec nicole-mongo mongodump --authenticationDatabase admin -u admin -p changeme_this_strong_password --out /tmp/backup
docker cp nicole-mongo:/tmp/backup ./backup-$(date +%Y%m%d)

# Restore
docker cp ./backup-20240101 nicole-mongo:/tmp/restore
docker exec nicole-mongo mongorestore --authenticationDatabase admin -u admin -p changeme_this_strong_password /tmp/restore
```

## Troubleshooting

### El servidor no se conecta a MongoDB

- Verificar que `MONGODB_URI` usa el hostname `mongo` (nombre del servicio)
- Verificar que las credenciales coinciden con `MONGO_ROOT_USER` y `MONGO_ROOT_PASSWORD`

### El frontend no encuentra la API

- Verificar que `VITE_API_URL=/api` en el build
- Verificar que Nginx tiene la ruta `/api/` configurada

### Puerto en uso

- Cambiar `NGINX_HTTP_PORT` y `NGINX_HTTPS_PORT` en `.env`

### Healthcheck falla

```bash
# Verificar health de un servicio
docker inspect --format='{{.State.Health.Status}}' nicole-server
docker inspect --format='{{json .State.Health}}' nicole-server | jq
```
