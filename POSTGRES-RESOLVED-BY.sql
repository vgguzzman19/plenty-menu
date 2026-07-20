-- PLENTY — Registra quién atendió cada aviso de mesa
-- Ejecutar en el Postgres del VPS

ALTER TABLE table_calls ADD COLUMN IF NOT EXISTS resolved_by TEXT;
