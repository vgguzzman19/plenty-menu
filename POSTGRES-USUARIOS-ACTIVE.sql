-- PLENTY — Deshabilitar temporalmente cuentas de empleado
-- Ejecutar en el Postgres del VPS

ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
