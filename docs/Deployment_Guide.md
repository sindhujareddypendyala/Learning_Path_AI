# LearnPath-AI Production Deployment Guide

This guide details the step-by-step procedures to deploy the integrated **LearnPath-AI** application to production. 

---

## Strategy A: VPS Deployment using Docker Compose (Recommended)

This is the easiest way to deploy both the frontend and backend on a single virtual server (e.g. DigitalOcean Droplet, Linode, AWS EC2, or Google Compute Engine).

### 1. Prerequisites
Ensure the target server has Git, Docker, and Docker Compose installed:
```bash
# Verify installations
docker --version
docker compose version
```

### 2. Prepare the Directory
Clone your repository and navigate to the directory on the host server:
```bash
git clone https://github.com/sindhujareddypendyala/Learning_Path_AI.git
cd Learning_Path_AI
```

### 3. Configure the Environment Variables
Create a production `.env` file from the example template:
```bash
cp .env.example .env
```
Open `.env` and configure:
- `SECRET_KEY`: Replace with a secure, random string (e.g., `openssl rand -hex 32`).
- `GROQ_API_KEY`: Input your production Groq Llama 3 API key.
- `DEBUG`: Set to `False`.

### 4. Build and Run the Containers
Start the multi-container orchestration in detached background mode:
```bash
docker compose up --build -d
```
Docker will build:
1. The **Backend** container running FastAPI and agents (port `8000`).
2. The **Frontend** container using Nginx to serve the React assets and reverse proxy API calls (port `80`).

### 5. Persistent Volumes
The configuration creates two persistent docker volumes:
- `sqlite_data`: Mounts at `/app/backend/database` on the container to store users and roadmaps.
- `chroma_data`: Mounts at `/app/backend/database/chroma_db` to store RAG embedding indexes.

---

## Strategy B: Managed Cloud Deployment (Render & Vercel)

If you prefer serverless/fully-managed deployments, you can split the frontend and backend.

### 1. Backend (FastAPI) on Render
1. Sign up on [Render](https://render.com/).
2. Create a new **Web Service** and link it to your GitHub Repository.
3. Configure the following settings:
   - **Environment**: `Docker`
   - **Docker Path**: `Dockerfile.backend` (Render will build the backend using our production Dockerfile)
   - **Instance Type**: Free or Starter
4. Add the following **Environment Variables** in the Render settings dashboard:
   - `GROQ_API_KEY`: `your_groq_api_key_here`
   - `SECRET_KEY`: `your_secure_random_string`
   - `DATABASE_URL`: `sqlite:///./backend/database/sqlite.db`
   - `DEBUG`: `False`
5. Click **Deploy Web Service**. Render will output a URL (e.g., `https://learnpath-backend.onrender.com`).

### 2. Frontend (React) on Vercel
1. Sign up on [Vercel](https://vercel.com/).
2. Import your GitHub repository.
3. Configure the following settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add a rewrite/proxy rule for API requests. Create a `vercel.json` file in the repository root:
   ```json
   {
     "rewrites": [
       { "source": "/api/:match*", "destination": "https://learnpath-backend.onrender.com/api/:match*" }
     ]
   }
   ```
5. Click **Deploy**. Vercel will build the frontend assets and host them globally on their CDN.

---

## Health Check and Verification
Once deployed, verify the health status:
- Check backend API: `http://<your-server-ip>/health`
- Check Swagger docs: `http://<your-server-ip>/docs`
- Open application interface: `http://<your-server-ip>/`
