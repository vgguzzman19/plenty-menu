-- PLENTY — Evita avisos duplicados: solo un aviso pendiente por mesa a la vez
-- Ejecutar en el Postgres del VPS

CREATE UNIQUE INDEX IF NOT EXISTS idx_table_calls_one_pending_per_table
  ON table_calls (table_number) WHERE resolved_at IS NULL;
