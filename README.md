# LearnPath-AI

An enterprise-grade, Multi-Agent Personalized Learning Platform built with Python, FastAPI, and LangChain.

## Features
- **Multi-Agent Orchestration**: Specialized AI agents (Curriculum, Content, Assessment, etc.) collaborating to build personalized learning paths.
- **RAG Architecture**: Integration with ChromaDB for factual, up-to-date knowledge retrieval.
- **Clean Architecture**: Highly modular, SOLID-compliant backend.

## Quickstart

1. **Environment Variables**:
   Copy `.env.example` to `.env` and add your Google Gemini API key.
   ```bash
   cp .env.example .env
   ```

2. **Setup**:
   Install dependencies and initialize vector database folders.
   ```bash
   python scripts/setup.py
   ```

3. **Initialize Database**:
   ```bash
   python scripts/create_db.py
   python scripts/seed_data.py
   ```

4. **Run Server**:
   ```bash
   python backend/main.py
   ```
   The API will be available at `http://localhost:8000`. Swagger UI is available at `http://localhost:8000/docs`.
