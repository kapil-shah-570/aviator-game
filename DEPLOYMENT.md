# Render Deployment Environment

Use these environment variables when deploying the two services on Render.

## Backend service

Set these in the backend service Environment section:

```env
NODE_ENV=production
MONGO_URI=your_atlas_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_connection_string
ADMIN_SECRET=your_admin_secret
FRONTEND_URL=https://your-frontend-service.onrender.com
```

`FRONTEND_URL` tells the backend which frontend is allowed to call the API and connect to Socket.IO.

## Frontend service

Set this in the frontend service Environment section:

```env
BACKEND_URL=https://your-backend-service.onrender.com
```

`BACKEND_URL` is used by every frontend API request and Socket.IO connection.

## Local development

Local values are already prepared:

```env
frontend/.env
BACKEND_URL=http://localhost:5000
```

```env
backend/.env
FRONTEND_URL=http://localhost:3000
```

The frontend still has a local Vite proxy for `/api` and `/socket.io`, but deployed builds use `BACKEND_URL`.
