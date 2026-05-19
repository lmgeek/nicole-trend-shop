# Deploy en Portainer - Nicole SRL

## Arquitectura

```
Internet :80/:443
    │
    ▼
┌─────────────────────────────────┐
│  Nginx (reverse proxy)          │
│  - /api/*      → Server :3001   │
│  - /*          → Frontend :80   │
│  - /api/health → Server :3001   │
└────────────┬────────────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌──────────┐  ┌────────────┐
│ Server   │  │ Frontend   │
│ Node.js  │  │ Nginx+React│
│ :3001    │  │ :80        │
└────┬─────┘  └────────────┘
     │
     │ mongodb://
     ▼
┌──────────┐
│ MongoDB  │
│ :27017   │
│ (red int)│
└──────────┘
```

## Requisitos del servidor

- Docker 20.10+ con Docker Compose v2
- Portainer CE/BE instalado
- Minimo 2GB RAM, 2 CPU cores
- Puertos 80 y 443 disponibles

## Paso 1: Preparar el repositorio

Subir el proyecto a GitHub/GitLab:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-org/nicole2.git
git push -u origin main
```

## Paso 2: Configurar variables de entorno en Portainer

Ir a **Portainer** → **Stacks** → **Add stack**

1. **Name**: `nicole-srl`
2. **Build method**: `Git Repository`
3. **Repository URL**: `https://github.com/tu-org/nicole2.git`
4. **Reference**: `main` (o tu branch)
5. **Base path**: `/`

### Variables de entorno (una por una)

| Variable | Valor requerido | Ejemplo |
|---|---|---|
| `MONGO_ROOT_USER` | Usuario admin MongoDB | `admin` |
| `MONGO_ROOT_PASSWORD` | Contraseña fuerte admin | `TuPasswordAdmin123!` |
| `MONGO_DB` | Nombre de la base | `nicole-trend-shop` |
| `MONGO_APP_USER` | Usuario de la app | `nicole_app` |
| `MONGO_APP_PASSWORD` | Contraseña app | `TuPasswordApp123!` |
| `JWT_SECRET` | Minimo 32 caracteres | `mi_secreto_jwt_de_32_chars_minimo` |
| `VITE_API_URL` | URL relativa de la API | `/api` |
| `NGINX_HTTP_PORT` | Puerto HTTP externo | `80` |
| `NGINX_HTTPS_PORT` | Puerto HTTPS externo | `443` |

## Paso 3: Deploy

Click en **Deploy the stack**.

Tiempo estimado: 3-5 minutos (build de imagenes).

## Verificar el deploy

### 1. Verificar que todos los servicios estan corriendo

Portainer → Stacks → nicole-srl → ver estado de cada servicio.

Todos deben mostrar `running` o `healthy`.

### 2. Verificar MongoDB

```bash
# Desde el servidor
docker exec -it nicole-srl-mongo-1 mongosh \
  -u admin -p TuPasswordAdmin123! \
  --authenticationDatabase admin \
  --eval "db.adminCommand('ping')"
```

Debe devolver: `{ ok: 1 }`

### 3. Verificar Backend

```bash
curl http://TU_IP_SERVIDOR/api/health
```

Debe devolver: `{"status":"ok"}`

### 4. Verificar Frontend

```bash
curl http://TU_IP_SERVIDOR/
```

Debe devolver el HTML del frontend.

## Logs

```bash
# Todos los servicios
docker compose -f /data/compose/nicole-srl/docker-compose.yml logs -f

# Solo backend
docker compose -f /data/compose/nicole-srl/docker-compose.yml logs -f server

# Solo MongoDB
docker compose -f /data/compose/nicole-srl/docker-compose.yml logs -f mongo

# Solo Nginx
docker compose -f /data/compose/nicole-srl/docker-compose.yml logs -f nginx
```

O desde Portainer: Stacks → nicole-srl → click en cada servicio → Logs.

## Configuracion SSL (Let's Encrypt)

### 1. Instalar Certbot

```bash
sudo apt install certbot -y
```

### 2. Generar certificado

```bash
sudo certbot certonly --standalone -d tudominio.com
```

### 3. Copiar certificados

```bash
sudo cp /etc/letsencrypt/live/tudominio.com/fullchain.pem \
  /ruta/al/repo/deploy/nginx/ssl/fullchain.pem
sudo cp /etc/letsencrypt/live/tudominio.com/privkey.pem \
  /ruta/al/repo/deploy/nginx/ssl/privkey.pem
```

### 4. Crear config SSL

```bash
cp deploy/nginx/conf.d/ssl.conf.example deploy/nginx/conf.d/ssl.conf
nano deploy/nginx/conf.d/ssl.conf
# Cambiar server_name por tu dominio
```

### 5. Redeployar

Portainer → Stacks → nicole-srl → **Repull and redeploy**.

### 6. Auto-renovacion

```bash
(crontab -l 2>/dev/null; echo "0 3 * * 1 certbot renew --quiet && docker compose -f /ruta/docker-compose.yml restart nginx") | crontab -
```

## Backup de MongoDB

### Backup automatico

```bash
#!/bin/bash
# /opt/scripts/mongo-backup.sh
BACKUP_DIR="/opt/backups/mongo/$(date +%Y%m%d_%H%M%S)"
mkdir -p $BACKUP_DIR

docker exec nicole-srl-mongo-1 mongodump \
  -u admin -p TuPasswordAdmin123! \
  --authenticationDatabase admin \
  --out /tmp/backup

docker cp nicole-srl-mongo-1:/tmp/backup $BACKUP_DIR

# Eliminar backups de mas de 7 dias
find /opt/backups/mongo -type d -mtime +7 -exec rm -rf {} +
```

```bash
chmod +x /opt/scripts/mongo-backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/scripts/mongo-backup.sh") | crontab -
```

### Restore manual

```bash
docker cp ./backup-dir nicole-srl-mongo-1:/tmp/restore
docker exec nicole-srl-mongo-1 mongorestore \
  -u admin -p TuPasswordAdmin123! \
  --authenticationDatabase admin \
  /tmp/restore
```

## Actualizacion del stack

### Via Portainer

1. Stacks → nicole-srl → **Repull and redeploy**
2. O editar el compose y click en **Update the stack**

### Via Git push

Si configuraste webhook, cada push a `main` redeploya automaticamente.

## Troubleshooting

### Stack no arranca

```bash
# Ver logs del stack
docker compose logs

# Verificar que las variables estan definidas
docker compose config
```

### MongoDB no inicia

- Verificar que `MONGO_ROOT_PASSWORD` no contiene caracteres especiales sin escape
- Verificar logs: `docker compose logs mongo`

### Server no se conecta a MongoDB

- Verificar que `MONGO_APP_USER` y `MONGO_APP_PASSWORD` coinciden
- Verificar que el healthcheck de mongo paso antes de que server intente conectar

### Nginx devuelve 502 Bad Gateway

- Verificar que frontend y server estan corriendo: `docker compose ps`
- Verificar logs de nginx: `docker compose logs nginx`

### Puerto 80 en uso

```bash
# Ver que proceso usa el puerto
sudo lsof -i :80
sudo ss -tlnp | grep :80

# Cambiar NGINX_HTTP_PORT en las variables de entorno
```

### Healthcheck falla

```bash
# Ver estado de health
docker inspect --format='{{.State.Health.Status}}' nicole-srl-server-1

# Ver detalles del healthcheck
docker inspect nicole-srl-server-1 | grep -A 20 Health
```

### Reset completo

```bash
# Detener y eliminar todo
docker compose down -v

# Redeployar desde Portainer
```

> **Nota**: `docker compose down -v` elimina los volumenes (datos de MongoDB). Hacer backup antes.
