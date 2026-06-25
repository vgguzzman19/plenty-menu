-- ============================================================
-- PLENTY — Actualización completa carta BEBIDAS (Junio 2026)
-- Incluye: categorías, productos y traducciones EN + FR
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── 1. ACTUALIZAR NOMBRES Y ORDEN DE CATEGORÍAS ──────────────
UPDATE categories SET name = 'Homemade Hot Lattes',  "order" = 7 WHERE name = 'Hot Lattes'       AND menu = 'drinks';
UPDATE categories SET name = 'Homemade Iced Lattes', "order" = 3 WHERE name = 'Iced Lattes'      AND menu = 'drinks';
UPDATE categories SET name = 'Alcoholic Drinks', emoji = '🍷', "order" = 4 WHERE name = 'Specialty Drinks' AND menu = 'drinks';
UPDATE categories SET name = 'Iced Frappés',         "order" = 2 WHERE name = 'Iced Frappes'     AND menu = 'drinks';
UPDATE categories SET "order" = 1 WHERE name = 'Super Smoothies' AND menu = 'drinks';
UPDATE categories SET "order" = 5 WHERE name = 'Soft Drinks'     AND menu = 'drinks';
UPDATE categories SET "order" = 6 WHERE name = 'Coffee Bar'      AND menu = 'drinks';
UPDATE categories SET "order" = 8 WHERE name = 'Organic Teas'    AND menu = 'drinks';

-- ── 2. ELIMINAR TODOS LOS PRODUCTOS DE BEBIDAS ───────────────
DELETE FROM products
WHERE category_id IN (SELECT id FROM categories WHERE menu = 'drinks');

-- ── 3. RE-INSERTAR PRODUCTOS ─────────────────────────────────

-- SUPER SMOOTHIES
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Pink Energy',    '', 5.50, '', true, 1, 'Pink Energy',    '', 'Pink Energy',    ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Berry Glow',     '', 5.95, '', true, 2, 'Berry Glow',     '', 'Berry Glow',     ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Clean Detox',    '', 5.50, '', true, 3, 'Clean Detox',    '', 'Clean Detox',    ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Purple Power',   '', 5.95, '', true, 4, 'Purple Power',   '', 'Purple Power',   ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Hydra Boost',    '', 5.95, '', true, 5, 'Hydra Boost',    '', 'Hydra Boost',    ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Red Roots',      '', 5.95, '', true, 6, 'Red Roots',      '', 'Red Roots',      ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Golden Yellow',  '', 5.95, '', true, 7, 'Golden Yellow',  '', 'Golden Yellow',  ''),
((SELECT id FROM categories WHERE name = 'Super Smoothies'), 'Smoothie Upgrades ✨', 'Ashwagandha · Maca · Proteína vegetal · Colágeno vegano · Blue Espirulina', 1.00, '', true, 8,
  'Smoothie Upgrades ✨', 'Ashwagandha · Maca · Vegan protein · Vegan collagen · Blue Spirulina',
  'Smoothie Upgrades ✨', 'Ashwagandha · Maca · Protéine végétale · Collagène vegan · Spiruline bleue');

-- ICED FRAPPÉS
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Iced Frappés'), 'Chocolate',   'Avena · Almendra · Coco (gratis) · Soja (+0,30€)', 5.50, '', true, 1, 'Chocolate',   'Oat · Almond · Coconut (free) · Soy (+0.30€)', 'Chocolat',   'Avoine · Amande · Coco (gratuit) · Soja (+0,30€)'),
((SELECT id FROM categories WHERE name = 'Iced Frappés'), 'Caramelo',    'Avena · Almendra · Coco (gratis) · Soja (+0,30€)', 5.50, '', true, 2, 'Caramel',    'Oat · Almond · Coconut (free) · Soy (+0.30€)', 'Caramel',    'Avoine · Amande · Coco (gratuit) · Soja (+0,30€)'),
((SELECT id FROM categories WHERE name = 'Iced Frappés'), 'Vainilla',    'Avena · Almendra · Coco (gratis) · Soja (+0,30€)', 5.50, '', true, 3, 'Vanilla',    'Oat · Almond · Coconut (free) · Soy (+0.30€)', 'Vanille',    'Avoine · Amande · Coco (gratuit) · Soja (+0,30€)'),
((SELECT id FROM categories WHERE name = 'Iced Frappés'), 'Extra: Shot Espresso',  '', 1.70, '', true, 4, 'Extra: Espresso Shot', '', 'Extra: Shot Espresso', ''),
((SELECT id FROM categories WHERE name = 'Iced Frappés'), 'Extra: Doble Espresso', '', 2.60, '', true, 5, 'Extra: Double Espresso', '', 'Extra: Double Espresso', '');

-- HOMEMADE ICED LATTES
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Shroom Latte',       '', 4.90, '', true, 1,  'Shroom Latte',       '', 'Shroom Latte',       ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Matcha Latte',       '', 5.50, '', true, 2,  'Matcha Latte',       '', 'Latte Matcha',       ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Pink Matcha Latte',  '', 6.30, '', true, 3,  'Pink Matcha Latte',  '', 'Latte Matcha Rose',  ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Blue Matcha Latte',  '', 6.30, '', true, 4,  'Blue Matcha Latte',  '', 'Latte Matcha Bleu',  ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Mango Matcha Latte', '', 5.50, '', true, 5,  'Mango Matcha Latte', '', 'Latte Matcha Mangue',''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Matcha Cloud Latte', '', 5.50, '', true, 6,  'Matcha Cloud Latte', '', 'Latte Matcha Cloud', ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Matcha Tonic',       '', 5.00, '', true, 7,  'Matcha Tonic',       '', 'Matcha Tonic',       ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Espresso Tonic',     '', 4.50, '', true, 8,  'Espresso Tonic',     '', 'Espresso Tonic',     ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Matcha Affogato',    '', 5.50, '', true, 9,  'Matcha Affogato',    '', 'Matcha Affogato',    ''),
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'), 'Espresso Affogato',  '', 5.00, '', true, 10, 'Espresso Affogato',  '', 'Espresso Affogato',  '');

-- ALCOHOLIC DRINKS
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Spritz / Bellini Maracuyá', 'Cóctel',          9.00, '', true, 1,  'Spritz / Passion Fruit Bellini', 'Cocktail', 'Spritz / Bellini Maracuya', 'Cocktail'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Espresso Martini',           'Cóctel',         10.00, '', true, 2,  'Espresso Martini',               'Cocktail', 'Espresso Martini',          'Cocktail'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Sangría Cava Clásica',       '1 Litro',        17.00, '', true, 3,  'Classic Cava Sangria',           '1 Litre',  'Sangria Cava Classique',    '1 Litre'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Sangría Cava Frutos Rojos',  '1 Litro',        18.00, '', true, 4,  'Red Berries Cava Sangria',       '1 Litre',  'Sangria Cava Fruits Rouges','1 Litre'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Rosé — Copa',                'Vino Natural',    5.50, '', true, 5,  'Rosé — Glass',   'Natural Wine', 'Rosé — Verre',  'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Rosé — Botella',             'Vino Natural',   27.00, '', true, 6,  'Rosé — Bottle',  'Natural Wine', 'Rosé — Bouteille', 'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Blanco — Copa',              'Vino Natural',    5.50, '', true, 7,  'White — Glass',  'Natural Wine', 'Blanc — Verre', 'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Blanco — Botella',           'Vino Natural',   32.00, '', true, 8,  'White — Bottle', 'Natural Wine', 'Blanc — Bouteille', 'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Tinto — Copa',               'Vino Natural',    6.50, '', true, 9,  'Red — Glass',    'Natural Wine', 'Rouge — Verre', 'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Tinto — Botella',            'Vino Natural',   30.00, '', true, 10, 'Red — Bottle',   'Natural Wine', 'Rouge — Bouteille', 'Vin Naturel'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'La Salve / Alhambra Radler', '33cl',            3.50, '', true, 11, 'La Salve / Alhambra Radler', '33cl', 'La Salve / Alhambra Radler', '33cl'),
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'), 'Cerveza Sin Alcohol',        '33cl',            3.60, '', true, 12, 'Non-Alcoholic Beer', '33cl', 'Bière Sans Alcool', '33cl');

-- SOFT DRINKS
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Agua sin gas 30cl',        '', 1.80, '', true, 1,  'Still Water 30cl',         '', 'Eau plate 30cl',          ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Agua con gas 30cl',        '', 2.20, '', true, 2,  'Sparkling Water 30cl',     '', 'Eau gazeuse 30cl',        ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Vichy Catalán 33cl',       '', 2.60, '', true, 3,  'Vichy Catalán 33cl',       '', 'Vichy Catalán 33cl',      ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Zumo de Naranja Exprimido','', 4.50, '', true, 4,  'Freshly Squeezed Orange Juice', '', 'Jus d''orange pressé',  ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Kombucha Yaya 33cl',       '', 5.50, '', true, 5,  'Kombucha Yaya 33cl',       '', 'Kombucha Yaya 33cl',      ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Petillant Vostok 33cl',    '', 3.90, '', true, 6,  'Vostok Sparkling 33cl',    '', 'Pétillant Vostok 33cl',   ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Limonada Mama Bio 33cl',   '', 3.60, '', true, 7,  'Mama Bio Lemonade 33cl',   '', 'Limonade Mama Bio 33cl',  ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Coca-Cola',                '', 2.60, '', true, 8,  'Coca-Cola',                '', 'Coca-Cola',               ''),
((SELECT id FROM categories WHERE name = 'Soft Drinks'), 'Coca-Cola Zero',           '', 2.60, '', true, 9,  'Coca-Cola Zero',           '', 'Coca-Cola Zéro',          '');

-- COFFEE BAR
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Espresso',        '', 1.70, '', true, 1, 'Espresso',        '', 'Espresso',        ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Doble Espresso',  '', 2.60, '', true, 2, 'Double Espresso', '', 'Double Espresso', ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Americano',       '', 2.20, '', true, 3, 'Americano',       '', 'Américano',       ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Cortado',         '', 2.10, '', true, 4, 'Cortado',         '', 'Café Noisette',   ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Flat White',      '', 3.20, '', true, 5, 'Flat White',      '', 'Flat White',      ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Capuccino',       '', 3.00, '', true, 6, 'Cappuccino',      '', 'Cappuccino',      ''),
((SELECT id FROM categories WHERE name = 'Coffee Bar'), 'Café con Leche',  '', 2.60, '', true, 7, 'Coffee with Milk','', 'Café au Lait',    '');

-- HOMEMADE HOT LATTES
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'), 'Matcha Latte',         '', 3.90, '', true, 1, 'Matcha Latte',         '', 'Latte Matcha',            ''),
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'), 'Hojicha Latte',        '', 3.90, '', true, 2, 'Hojicha Latte',        '', 'Latte Hojicha',           ''),
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'), 'Chai Latte',           '', 3.90, '', true, 3, 'Chai Latte',           '', 'Latte Chai',              ''),
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'), 'Banana Bread Latte',   '', 4.00, '', true, 4, 'Banana Bread Latte',   '', 'Latte Banana Bread',      ''),
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'), 'Toasted Peanut Latte', '', 4.00, '', true, 5, 'Toasted Peanut Latte', '', 'Latte Cacahuète Grillé',  '');

-- ORGANIC TEAS
INSERT INTO products (category_id, name, description, price, image_url, available, "order",
  name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Ayurveda',          'Infusión',  3.20, '', true, 1,  'Ayurveda',          'Herbal infusion', 'Ayurveda',          'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Lovely Afternoon',  'Infusión',  3.20, '', true, 2,  'Lovely Afternoon',  'Herbal infusion', 'Lovely Afternoon',  'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Manzanilla',        'Infusión',  3.20, '', true, 3,  'Chamomile',         'Herbal infusion', 'Camomille',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Digestión',         'Infusión',  3.20, '', true, 4,  'Digestion',         'Herbal infusion', 'Digestion',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Rooibos',           'Infusión',  3.20, '', true, 5,  'Rooibos',           'Herbal infusion', 'Rooibos',           'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Sueño Tropical',    'Infusión',  3.20, '', true, 6,  'Tropical Dream',    'Herbal infusion', 'Rêve Tropical',     'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Speculoos',         'Infusión',  3.20, '', true, 7,  'Speculoos',         'Herbal infusion', 'Spéculoos',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Mint',              'Té Verde',  3.20, '', true, 8,  'Mint',              'Green Tea',       'Menthe',            'Thé Vert'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Earl Grey',         'Té Verde',  3.20, '', true, 9,  'Earl Grey',         'Green Tea',       'Earl Grey',         'Thé Vert'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'English Breakfast', 'Té Negro',  3.20, '', true, 10, 'English Breakfast', 'Black Tea',       'English Breakfast', 'Thé Noir');

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
