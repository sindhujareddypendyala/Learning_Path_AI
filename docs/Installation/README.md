# Local Installation Guide

## Prerequisites
- Python 3.12+
- Docker (optional, for vector database isolation)

## Setup Steps
1. Clone the repository.
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment.
4. Install dependencies: `pip install -r backend/requirements.txt`
5. Copy `.env.example` to `.env` and insert your Gemini API Key.
6. Run the migrations: `alembic upgrade head`
7. Start the server: `python backend/main.py`
