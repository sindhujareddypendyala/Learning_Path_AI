# Database Migrations

This directory contains Alembic migration scripts. 
As the SQLAlchemy models change in `backend/models/`, new migration scripts will be auto-generated here.

To apply migrations, run:
```bash
alembic upgrade head
```
