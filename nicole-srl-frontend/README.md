# Nicole SRL - Frontend

Frontend para Nicole Trend Shop.

## Desarrollo

```bash
cp .env.example .env
npm install
npm run dev
```

## Producción (Docker)

```bash
docker build --build-arg VITE_API_URL=http://TU_DOMINIO:3001 -t nicole-frontend .
docker run -d -p 80:80 --name nicole-frontend nicole-frontend
```

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL del backend API | `http://localhost:3001` |

## Estructura

```
src/
├── admin/          # Panel de administración
├── components/     # Componentes compartidos
├── hooks/          # Custom hooks
├── lib/            # Utilidades y contextos
├── pages/          # Páginas públicas
└── services/       # Servicios API
```
