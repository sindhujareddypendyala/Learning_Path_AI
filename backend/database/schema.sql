-- This schema is auto-managed by SQLAlchemy and Alembic.
-- This file serves as a raw SQL reference for the initial state.

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR NOT NULL UNIQUE,
    hashed_password VARCHAR NOT NULL,
    is_active BOOLEAN DEFAULT 1
);

CREATE INDEX ix_users_email ON users (email);
CREATE INDEX ix_users_id ON users (id);
