-- PLENTY — Encuesta de satisfacción al pedir la cuenta
-- Ejecutar en el Postgres del VPS

CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  table_number INTEGER NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback (created_at DESC);
