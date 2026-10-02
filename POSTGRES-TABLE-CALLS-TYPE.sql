-- PLENTY — Tipo de aviso: "listo para pedir" o "la cuenta, por favor"
-- Ejecutar en el Postgres del VPS

ALTER TABLE table_calls ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'order';

-- Antes solo se permitía un aviso pendiente por mesa (de cualquier tipo).
-- Ahora se permite uno de cada tipo a la vez: pedir y cuenta son independientes.
DROP INDEX IF EXISTS idx_table_calls_one_pending_per_table;
CREATE UNIQUE INDEX IF NOT EXISTS idx_table_calls_one_pending_per_table_type
  ON table_calls (table_number, type) WHERE resolved_at IS NULL;
