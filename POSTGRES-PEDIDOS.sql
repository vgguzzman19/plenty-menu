-- PLENTY — Avisos de "Listo para pedir" por mesa
-- Ejecutar en el Postgres del VPS (psql, o el cliente que uses)

CREATE TABLE table_calls (
  id SERIAL PRIMARY KEY,
  table_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Acelera la consulta de "pendientes" que usa el panel admin
CREATE INDEX idx_table_calls_pending ON table_calls (created_at) WHERE resolved_at IS NULL;
