-- PLENTY — Badge destacado en productos
-- Ejecutar en: Supabase → SQL Editor → New query → Run

ALTER TABLE products ADD COLUMN IF NOT EXISTS badge text DEFAULT NULL;
