-- ============================================================
-- PLENTY — Nueva carta completa (Junio 2026)
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. Añadir columna "menu" a categorías
ALTER TABLE categories ADD COLUMN IF NOT EXISTS menu TEXT NOT NULL DEFAULT 'food';

-- 2. Limpiar datos antiguos (conserva la tabla users/admin)
TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- ============================================================
-- CATEGORÍAS — CARTA (comida)
-- ============================================================
INSERT INTO categories (name, emoji, "order", menu) VALUES
('Signature Bowls', '🥗', 1, 'food'),
('Banana Bread',    '🍞', 2, 'food'),
('Pancakes',        '🥞', 3, 'food'),
('Toasts',          '🍳', 4, 'food'),
('Burgers',         '🍔', 5, 'food'),
('Garden Bowls',    '🌿', 6, 'food'),
('Extras',          '✨', 7, 'food');

-- ============================================================
-- CATEGORÍAS — BEBIDAS
-- ============================================================
INSERT INTO categories (name, emoji, "order", menu) VALUES
('Coffee Bar',       '☕', 1, 'drinks'),
('Hot Lattes',       '✨', 2, 'drinks'),
('Iced Lattes',      '🧊', 3, 'drinks'),
('Specialty Drinks', '⭐', 4, 'drinks'),
('Organic Teas',     '🍵', 5, 'drinks'),
('Soft Drinks',      '🥤', 6, 'drinks'),
('Super Smoothies',  '💚', 7, 'drinks'),
('Iced Frappes',     '🧋', 8, 'drinks');

-- ============================================================
-- PRODUCTOS — CARTA (comida)
-- IDs de categoría: Signature Bowls=1, Banana Bread=2,
-- Pancakes=3, Toasts=4, Burgers=5, Garden Bowls=6, Extras=7
-- ============================================================

-- Signature Bowls
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(1, 'Granola Classic', 'Nuestra granola casera, yogur griego, miel', 9.50, '', true, 1),
(1, 'Chia Pudding',    'Chia pudding con leche de almendras, açaí + healthy toppings', 9.00, '', true, 2),
(1, 'Acai Bliss',      'Pure de acai, mantequilla de cacahuete, nuestro granola, frutas & healthy toppings', 11.50, '', true, 3);

-- Banana Bread (sin gluten disponible +€1,00)
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(2, 'Dubai Style',  'Yogur, dip pistachio', 6.50, '', true, 1),
(2, 'Monkey',       'Yogur, chocolate caliente, banana, crema de pistachio & katafi', 6.50, '', true, 2),
(2, 'Tatin',        'Yogur, caramelito salado, compota', 6.50, '', true, 3),
(2, 'Playa',        'Yogur, coco, caramelito & chocolate', 6.50, '', true, 4),
(2, 'Cheesecake',   'Yogur, salsa de cereza, chocolate blanco, melocotón, almendras', 6.50, '', true, 5),
(2, 'Cherry Melba', 'Yogur, salsa de cereza, crema, melocotón, almendras', 6.50, '', true, 6),
(2, 'Affogato BB',  'Banana Bread con helado de vainilla & espresso caliente', 7.50, '', true, 7),
(2, 'Simply',       'Mantequilla & canela', 4.50, '', true, 8);

-- Pancakes
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(3, 'Quebec',    'Plátano, arándanos, nuestro granola & sirope de arce', 10.50, '', true, 1),
(3, 'Pistachio', 'Virutas de mango, chocolate blanco, coco rallado, katafi', 10.50, '', true, 2),
(3, 'Abuela',    'Compota de manzana, crema de mantequilla', 10.50, '', true, 3),
(3, 'Maracuya',  'Maracuyá, frutas tropicales', 10.50, '', true, 4);

-- Toasts
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(4, 'Hummus',       'Pan, hummus, feta de oveja, sésamo, kimchi y encurtidos de verduras caseros', 12.00, '', true, 1),
(4, 'Mango Bite',   'Pan, ricotta casera, chutney mango & bacon a la plancha', 12.50, '', true, 2),
(4, 'Silky Smoke',  'Pan, aguacate, ricotta casera, salmón ahumado & semillas', 13.00, '', true, 3),
(4, 'Sydney Smoke', 'Pan, aguacate, ricotta casera, semillas de calabaza', 13.00, '', true, 4);

-- Burgers
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(5, 'Oh My Eggs!', 'Pan, aguacate, huevo pochado & salsa crujiente', 10.00, '', true, 1),
(5, 'Brekkie',     'Cheddar, huevo, bacon, cebolla caída & salsas BBQ', 12.50, '', true, 2),
(5, 'Vege',        'Opción vegetariana del día', 12.00, '', true, 3),
(5, 'Nica',        'Pulled pork', 13.50, '', true, 4);

-- Garden Bowls
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(6, 'Ricotta Casera',     'Lechuga, pepino, edamame, tomates, rábanos, granola, salsa japonesa de sésamo & mini pitas con ricotta casera', 14.00, '', true, 1),
(6, 'Con Salmón Ahumado', 'Lechuga, pepino, edamame, tomates, rábanos, granola, salsa japonesa de sésamo & mini pitas con salmón ahumado', 16.00, '', true, 2);

-- Extras
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(7, 'Huevo frito o pochado', '', 1.60, '', true, 1),
(7, 'Feta DOP de oveja',     '', 2.50, '', true, 2),
(7, 'Guacamole casero',      '', 2.50, '', true, 3),
(7, 'Vegetal salteado',      '', 2.50, '', true, 4),
(7, 'Bacon a la plancha',    '', 2.00, '', true, 5),
(7, 'Salmón ahumado',        '', 4.00, '', true, 6);

-- ============================================================
-- PRODUCTOS — BEBIDAS
-- IDs: Coffee Bar=8, Hot Lattes=9, Iced Lattes=10,
-- Specialty=11, Teas=12, Soft=13, Smoothies=14, Frappes=15
-- ============================================================

-- Coffee Bar
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(8, 'Double Espresso', '', 2.40, '', true, 1),
(8, 'Americano',       '', 2.60, '', true, 2),
(8, 'Flat White',      '', 2.80, '', true, 3),
(8, 'Cappuccino',      '', 3.00, '', true, 4),
(8, 'Café con Leche',  '', 3.00, '', true, 5);

-- Hot Lattes
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(9, 'Matcha Latte',       '', 4.00, '', true, 1),
(9, 'Motion Latte',       '', 4.00, '', true, 2),
(9, 'Banana Bread Latte', '', 4.00, '', true, 3),
(9, 'Toffee Pecan Latte', '', 4.00, '', true, 4);

-- Iced Lattes
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(10, 'Espresso Tonic',  '', 3.80, '', true, 1),
(10, 'Espresso Matcha', '', 4.80, '', true, 2),
(10, 'Espresso Afogato','', 4.00, '', true, 3);

-- Specialty Drinks (id=11) — añade manualmente desde el panel admin
-- (no legible en la foto, añadir desde /admin)

-- Organic Teas
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(12, 'Organic Tea', 'Selección de tés ecológicos de temporada', 3.20, '', true, 1);

-- Soft Drinks
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(13, 'Coca-Cola / Zero 33cl', '', 2.40, '', true, 1),
(13, 'Agua con Gas 33cl',     '', 2.50, '', true, 2),
(13, 'Limonada',              '', 3.50, '', true, 3);

-- Super Smoothies
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(14, 'Pine Energy',    '', 5.50, '', true, 1),
(14, 'Clean Detox',   '', 5.50, '', true, 2),
(14, 'Purple Power',  '', 5.50, '', true, 3),
(14, 'Herbal Boost',  '', 5.95, '', true, 4),
(14, 'Red Roots',     '', 5.95, '', true, 5),
(14, 'Tum Tum Energy','', 5.45, '', true, 6),
(14, 'Coco',          '', 5.45, '', true, 7);

-- Iced Frappes
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
(15, 'Chocolate Frappe', '', 5.50, '', true, 1),
(15, 'Vanilla Frappe',   '', 5.50, '', true, 2),
(15, 'Coco Frappe',      '', 5.50, '', true, 3);

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
