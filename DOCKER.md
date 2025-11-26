# 🐳 Docker Setup Guide

## Prerequisites

- Docker Desktop installed and running
- At least 4GB RAM available

## 📦 Quick Start (Easiest Way)

### Run entire application with one command:

```bash
docker-compose up
```

That's it! 🎉

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

### Stop the application:

```bash
# Press Ctrl+C in terminal

# Or run in another terminal:
docker-compose down
```

---

## 🔧 Individual Service Commands

### Run Backend Only:

```bash
cd helpdesk-backend
docker build -t helpdesk-backend .
docker run -p 5000:5000 helpdesk-backend
```

### Run Frontend Only:

```bash
cd helpdesk-frontend
docker build -t helpdesk-frontend .
docker run -p 3000:80 helpdesk-frontend
```

---

## 🛠️ Useful Docker Commands

### View running containers:
```bash
docker ps
```

### View logs:
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend
docker-compose logs frontend

# Follow logs
docker-compose logs -f
```

### Rebuild after code changes:
```bash
docker-compose up --build
```

### Clean up:
```bash
# Stop and remove containers
docker-compose down

# Remove images
docker-compose down --rmi all

# Remove everything including volumes
docker-compose down -v --rmi all
```

---

## 🔍 Troubleshooting

### Port already in use:
```bash
# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Frontend on port 3001
  - "5001:5000"  # Backend on port 5001
```

### Container won't start:
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Restart specific service
docker-compose restart backend
```

### Need fresh start:
```bash
# Remove everything and rebuild
docker-compose down -v
docker-compose up --build
```

---

## 📝 File Structure

```
helpdesk-assignment/
├── docker-compose.yml           # Main orchestration file
├── helpdesk-backend/
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Files to exclude
│   └── ...
├── helpdesk-frontend/
│   ├── Dockerfile              # Frontend container config
│   ├── .dockerignore           # Files to exclude
│   ├── nginx.conf              # Web server config
│   └── ...
└── DOCKER.md                   # This file
```

---

## 🚀 Production Deployment

### Build production images:
```bash
docker-compose -f docker-compose.yml build
```

### Push to Docker Hub:
```bash
# Tag images
docker tag helpdesk-backend:latest yourusername/helpdesk-backend:latest
docker tag helpdesk-frontend:latest yourusername/helpdesk-frontend:latest

# Push
docker push yourusername/helpdesk-backend:latest
docker push yourusername/helpdesk-frontend:latest
```

---

## 💡 Tips

1. **First time setup**: `docker-compose up` will take 2-3 minutes to download and build
2. **Subsequent runs**: Much faster (uses cached layers)
3. **Code changes**: Run `docker-compose up --build` to rebuild
4. **Clean slate**: Use `docker-compose down -v` then `docker-compose up --build`

---

## ❓ Common Questions

**Q: Do I need to install Node.js?**  
A: No! Docker handles everything.

**Q: Can I still develop without Docker?**  
A: Yes! Use `npm run dev` as usual.

**Q: Why use Docker?**  
A: Easier deployment, consistent environment, reviewer can run with one command.

---

## 🎯 For Assignment Reviewers

To run this project:

1. Install Docker Desktop
2. Clone the repository
3. Run: `docker-compose up`
4. Open: http://localhost:3000

That's all! No Node.js, no npm install, no configuration needed.