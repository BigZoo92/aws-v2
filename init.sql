CREATE SCHEMA IF NOT EXISTS app_schema;

SET search_path TO app_schema;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);

INSERT INTO users (name, email) VALUES ('Alice', 'alice@example.com');
