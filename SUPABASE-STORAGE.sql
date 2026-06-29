-- PLENTY — Bucket de imágenes para productos
-- Ejecutar en: Supabase → SQL Editor → New query → Run

-- Crear bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Permitir lectura pública
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Permitir subida (el service role key de la API lo gestiona)
CREATE POLICY "Allow upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow delete product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images');
