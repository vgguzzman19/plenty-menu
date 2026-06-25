-- ============================================================
-- PLENTY — Carta BEBIDAS completa y correcta (Junio 2026)
-- Incluye nombres, descripciones, precios y traducciones EN+FR
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── 1. ACTUALIZAR CATEGORÍAS (funciona tanto si ya se ejecutó el SQL anterior como si no) ──
UPDATE categories SET name = 'Homemade Hot Lattes',  "order" = 7 WHERE (name = 'Hot Lattes'       OR name = 'Homemade Hot Lattes')  AND menu = 'drinks';
UPDATE categories SET name = 'Homemade Iced Lattes', "order" = 3 WHERE (name = 'Iced Lattes'      OR name = 'Homemade Iced Lattes') AND menu = 'drinks';
UPDATE categories SET name = 'Alcoholic Drinks', emoji = '🍷', "order" = 4 WHERE (name = 'Specialty Drinks' OR name = 'Alcoholic Drinks') AND menu = 'drinks';
UPDATE categories SET name = 'Iced Frappés',         "order" = 2 WHERE (name = 'Iced Frappes'     OR name = 'Iced Frappés')        AND menu = 'drinks';
UPDATE categories SET "order" = 1 WHERE name = 'Super Smoothies'    AND menu = 'drinks';
UPDATE categories SET "order" = 5 WHERE name = 'Soft Drinks'        AND menu = 'drinks';
UPDATE categories SET "order" = 6 WHERE name = 'Coffee Bar'         AND menu = 'drinks';
UPDATE categories SET "order" = 8 WHERE name = 'Organic Teas'       AND menu = 'drinks';

-- ── 2. BORRAR TODOS LOS PRODUCTOS DE BEBIDAS ─────────────────
DELETE FROM products WHERE category_id IN (SELECT id FROM categories WHERE menu = 'drinks');

-- ── 3. REINSERTAR CON DATOS CORRECTOS ────────────────────────

-- ══ SUPER SMOOTHIES ══════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Pink Energy', 'Fresa.', 5.50, '', true, 1,
 'Pink Energy', 'Strawberry.', 'Pink Energy', 'Fraise.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Berry Glow', 'Fresa, mora y frambuesa.', 5.95, '', true, 2,
 'Berry Glow', 'Strawberry, blackberry and raspberry.', 'Berry Glow', 'Fraise, mûre et framboise.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Clean Detox', 'Espinaca, manzana y kale.', 5.50, '', true, 3,
 'Clean Detox', 'Spinach, apple and kale.', 'Clean Detox', 'Épinards, pomme et chou kale.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Purple Power', 'Plátano, grosella, arándano y cereza.', 5.95, '', true, 4,
 'Purple Power', 'Banana, blackcurrant, blueberry and cherry.', 'Purple Power', 'Banane, cassis, myrtille et cerise.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Hydra Boost', 'Coco, mango y plátano.', 5.95, '', true, 5,
 'Hydra Boost', 'Coconut, mango and banana.', 'Hydra Boost', 'Coco, mangue et banane.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Red Roots', 'Remolacha, piña, arándano y jengibre.', 5.95, '', true, 6,
 'Red Roots', 'Beetroot, pineapple, blueberry and ginger.', 'Red Roots', 'Betterave, ananas, myrtille et gingembre.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Golden Yellow', 'Mango, melocotón, piña y maracuyá.', 5.95, '', true, 7,
 'Golden Yellow', 'Mango, peach, pineapple and passion fruit.', 'Golden Yellow', 'Mangue, pêche, ananas et maracuya.'),

((SELECT id FROM categories WHERE name = 'Super Smoothies'),
 'Upgrade your Smoothie',
 'Ashwagandha — reducción del estrés · Maca — energía · Proteína vegetal (guisantes) — fuerza · Colágeno vegano — luminosidad natural · Blue espirulina — antioxidante',
 1.00, '', true, 8,
 'Upgrade your Smoothie',
 'Ashwagandha — stress reduction · Maca — energy · Pea protein — strength · Vegan collagen — natural glow · Blue spirulina — antioxidant',
 'Upgrade your Smoothie',
 'Ashwagandha — réduction du stress · Maca — énergie · Protéine végétale (pois) — force · Collagène vegan — éclat naturel · Spiruline bleue — antioxydant');

-- ══ ICED FRAPPÉS ═════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Chocolate', 'Leche helada, nata montada y galleta.', 5.50, '', true, 1,
 'Chocolate', 'Iced milk, whipped cream and cookie.', 'Chocolat', 'Lait glacé, chantilly et biscuit.'),

((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Caramelo', 'Leche helada, nata montada y galleta.', 5.50, '', true, 2,
 'Caramel', 'Iced milk, whipped cream and cookie.', 'Caramel', 'Lait glacé, chantilly et biscuit.'),

((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Vainilla', 'Leche helada, nata montada y galleta.', 5.50, '', true, 3,
 'Vanilla', 'Iced milk, whipped cream and cookie.', 'Vanille', 'Lait glacé, chantilly et biscuit.'),

((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Extra: Shot de Espresso', '', 1.70, '', true, 4,
 'Extra: Espresso Shot', '', 'Extra: Shot Espresso', ''),

((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Extra: Doble Espresso', '', 2.60, '', true, 5,
 'Extra: Double Espresso', '', 'Extra: Double Espresso', ''),

((SELECT id FROM categories WHERE name = 'Iced Frappés'),
 'Leche vegetal', 'Avena · Almendra · Coco · Soja', 0.30, '', true, 6,
 'Plant milk', 'Oat · Almond · Coconut · Soy', 'Lait végétal', 'Avoine · Amande · Coco · Soja');

-- ══ HOMEMADE ICED LATTES ═════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Shroom Latte', 'Espresso y leche.', 4.90, '', true, 1,
 'Shroom Latte', 'Espresso and milk.', 'Shroom Latte', 'Espresso et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Matcha Latte', 'Matcha premium y leche.', 5.50, '', true, 2,
 'Matcha Latte', 'Premium matcha and milk.', 'Latte Matcha', 'Matcha premium et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Pink Matcha Latte', 'Remolacha premium y leche.', 6.30, '', true, 3,
 'Pink Matcha Latte', 'Premium beetroot and milk.', 'Latte Matcha Rose', 'Betterave premium et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Blue Matcha Latte', 'Blue spirulina premium y leche.', 6.30, '', true, 4,
 'Blue Matcha Latte', 'Premium blue spirulina and milk.', 'Latte Matcha Bleu', 'Spiruline bleue premium et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Mango Matcha Latte', 'Mango, coco, matcha premium y leche.', 5.50, '', true, 5,
 'Mango Matcha Latte', 'Mango, coconut, premium matcha and milk.', 'Latte Matcha Mangue', 'Mangue, coco, matcha premium et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Matcha Cloud Latte', 'Matcha premium, coco y leche.', 5.50, '', true, 6,
 'Matcha Cloud Latte', 'Premium matcha, coconut and milk.', 'Latte Matcha Cloud', 'Matcha premium, coco et lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Matcha Tonic', 'Tónica, matcha premium y espresso.', 5.00, '', true, 7,
 'Matcha Tonic', 'Tonic water, premium matcha and espresso.', 'Matcha Tonic', 'Eau tonique, matcha premium et espresso.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Espresso Tonic', 'Tónica y espresso.', 4.50, '', true, 8,
 'Espresso Tonic', 'Tonic water and espresso.', 'Espresso Tonic', 'Eau tonique et espresso.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Matcha Affogato', 'Matcha premium, helado de vainilla y espresso.', 5.50, '', true, 9,
 'Matcha Affogato', 'Premium matcha, vanilla ice cream and espresso.', 'Matcha Affogato', 'Matcha premium, glace vanille et espresso.'),

((SELECT id FROM categories WHERE name = 'Homemade Iced Lattes'),
 'Espresso Affogato', 'Espresso, helado de vainilla.', 5.00, '', true, 10,
 'Espresso Affogato', 'Espresso, vanilla ice cream.', 'Espresso Affogato', 'Espresso, glace vanille.');

-- ══ ALCOHOLIC DRINKS ═════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Spritz / Bellini Maracuyá', '', 9.00, '', true, 1,
 'Spritz / Passion Fruit Bellini', '', 'Spritz / Bellini Maracuya', ''),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Espresso Martini', '', 10.00, '', true, 2,
 'Espresso Martini', '', 'Espresso Martini', ''),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Sangría Cava Clásica', '1 Litro', 17.00, '', true, 3,
 'Classic Cava Sangria', '1 Litre', 'Sangria Cava Classique', '1 Litre'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Sangría Cava Frutos Rojos', '1 Litro', 18.00, '', true, 4,
 'Red Berries Cava Sangria', '1 Litre', 'Sangria Cava Fruits Rouges', '1 Litre'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Rosé — Copa', 'Vino Natural', 5.50, '', true, 5,
 'Rosé — Glass', 'Natural Wine', 'Rosé — Verre', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Rosé — Botella', 'Vino Natural', 27.00, '', true, 6,
 'Rosé — Bottle', 'Natural Wine', 'Rosé — Bouteille', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Blanco — Copa', 'Vino Natural', 5.50, '', true, 7,
 'White — Glass', 'Natural Wine', 'Blanc — Verre', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Blanco — Botella', 'Vino Natural', 32.00, '', true, 8,
 'White — Bottle', 'Natural Wine', 'Blanc — Bouteille', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Tinto — Copa', 'Vino Natural', 6.50, '', true, 9,
 'Red — Glass', 'Natural Wine', 'Rouge — Verre', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Tinto — Botella', 'Vino Natural', 30.00, '', true, 10,
 'Red — Bottle', 'Natural Wine', 'Rouge — Bouteille', 'Vin Naturel'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Cerveza 33cl', 'La Salve / Alhambra Radler', 3.50, '', true, 11,
 'Beer 33cl', 'La Salve / Alhambra Radler', 'Bière 33cl', 'La Salve / Alhambra Radler'),

((SELECT id FROM categories WHERE name = 'Alcoholic Drinks'),
 'Cerveza sin alcohol 33cl', 'Lúpulo · Cereza · Cítrico', 3.60, '', true, 12,
 'Non-Alcoholic Beer 33cl', 'Hop · Cherry · Citrus', 'Bière Sans Alcool 33cl', 'Houblon · Cerise · Agrumes');

-- ══ SOFT DRINKS ══════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Agua sin gas 30cl', '', 1.80, '', true, 1,
 'Still Water 30cl', '', 'Eau plate 30cl', ''),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Agua con gas 30cl', '', 2.20, '', true, 2,
 'Sparkling Water 30cl', '', 'Eau gazeuse 30cl', ''),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Vichy Catalán 33cl', '', 2.60, '', true, 3,
 'Vichy Catalán 33cl', '', 'Vichy Catalán 33cl', ''),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Zumo de naranja exprimido', '', 4.50, '', true, 4,
 'Freshly squeezed orange juice', '', 'Jus d''orange pressé', ''),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Kombucha Yaya 33cl', 'Jengibre · Mango y maracuyá · Frambuesa y romero.', 5.50, '', true, 5,
 'Kombucha Yaya 33cl', 'Ginger · Mango and passion fruit · Raspberry and rosemary.', 'Kombucha Yaya 33cl', 'Gingembre · Mangue et maracuya · Framboise et romarin.'),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Petillant Vostok 33cl', 'Pera y Romero.', 3.90, '', true, 6,
 'Vostok Sparkling 33cl', 'Pear and Rosemary.', 'Pétillant Vostok 33cl', 'Poire et Romarin.'),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Limonada Mama Bio 33cl', 'Limón.', 3.60, '', true, 7,
 'Mama Bio Lemonade 33cl', 'Lemon.', 'Limonade Mama Bio 33cl', 'Citron.'),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Coca-Cola', '', 2.60, '', true, 8,
 'Coca-Cola', '', 'Coca-Cola', ''),

((SELECT id FROM categories WHERE name = 'Soft Drinks'),
 'Coca-Cola Zero', '', 2.60, '', true, 9,
 'Coca-Cola Zero', '', 'Coca-Cola Zéro', '');

-- ══ COFFEE BAR ═══════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Espresso', '', 1.70, '', true, 1,
 'Espresso', '', 'Espresso', ''),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Doble Espresso', '', 2.60, '', true, 2,
 'Double Espresso', '', 'Double Espresso', ''),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Americano', 'Espresso + 120 ml de agua.', 2.20, '', true, 3,
 'Americano', 'Espresso + 120ml water.', 'Américano', 'Espresso + 120 ml d''eau.'),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Cortado', 'Espresso + 30 ml de leche.', 2.10, '', true, 4,
 'Cortado', 'Espresso + 30ml milk.', 'Café Noisette', 'Espresso + 30 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Flat White', 'Espresso + 120 ml de leche.', 3.20, '', true, 5,
 'Flat White', 'Espresso + 120ml milk.', 'Flat White', 'Espresso + 120 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Capuccino', 'Espresso + 120 ml de leche + espuma.', 3.00, '', true, 6,
 'Cappuccino', 'Espresso + 120ml milk + foam.', 'Cappuccino', 'Espresso + 120 ml de lait + mousse.'),

((SELECT id FROM categories WHERE name = 'Coffee Bar'),
 'Café con Leche', 'Espresso + 120 ml de leche.', 2.60, '', true, 7,
 'Coffee with Milk', 'Espresso + 120ml milk.', 'Café au Lait', 'Espresso + 120 ml de lait.');

-- ══ HOMEMADE HOT LATTES ══════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'),
 'Matcha Latte', 'Matcha premium, energía. 150 ml de leche.', 3.90, '', true, 1,
 'Matcha Latte', 'Premium matcha, energy. 150ml milk.', 'Latte Matcha', 'Matcha premium, énergie. 150 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'),
 'Hojicha Latte', 'Hojicha, calma. 150 ml de leche.', 3.90, '', true, 2,
 'Hojicha Latte', 'Hojicha, calm. 150ml milk.', 'Latte Hojicha', 'Hojicha, calme. 150 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'),
 'Chai Latte', 'Té Chai, felicidad suave. 150 ml de leche.', 3.90, '', true, 3,
 'Chai Latte', 'Chai tea, gentle happiness. 150ml milk.', 'Latte Chai', 'Thé chai, douceur. 150 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'),
 'Banana Bread Latte', 'Especias caseras, confort. 150 ml de leche.', 4.00, '', true, 4,
 'Banana Bread Latte', 'Homemade spices, comfort. 150ml milk.', 'Latte Banana Bread', 'Épices maison, réconfort. 150 ml de lait.'),

((SELECT id FROM categories WHERE name = 'Homemade Hot Lattes'),
 'Toasted Peanut Latte', 'Espresso, mantequilla de cacahuete, fuerza. 150 ml de leche.', 4.00, '', true, 5,
 'Toasted Peanut Latte', 'Espresso, peanut butter, strength. 150ml milk.', 'Latte Cacahuète Grillé', 'Espresso, beurre de cacahuète, force. 150 ml de lait.');

-- ══ ORGANIC TEAS ═════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Ayurveda',         'Infusión', 3.20, '', true, 1,  'Ayurveda',          'Herbal infusion', 'Ayurveda',          'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Lovely Afternoon', 'Infusión', 3.20, '', true, 2,  'Lovely Afternoon',  'Herbal infusion', 'Lovely Afternoon',  'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Manzanilla',       'Infusión', 3.20, '', true, 3,  'Chamomile',         'Herbal infusion', 'Camomille',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Digestión',        'Infusión', 3.20, '', true, 4,  'Digestion',         'Herbal infusion', 'Digestion',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Rooibos',          'Infusión', 3.20, '', true, 5,  'Rooibos',           'Herbal infusion', 'Rooibos',           'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Sueño Tropical',   'Infusión', 3.20, '', true, 6,  'Tropical Dream',    'Herbal infusion', 'Rêve Tropical',     'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Speculoos',        'Infusión', 3.20, '', true, 7,  'Speculoos',         'Herbal infusion', 'Spéculoos',         'Infusion'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Mint',             'Té Verde', 3.20, '', true, 8,  'Mint',              'Green Tea',       'Menthe',            'Thé Vert'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'Earl Grey',        'Té Verde', 3.20, '', true, 9,  'Earl Grey',         'Green Tea',       'Earl Grey',         'Thé Vert'),
((SELECT id FROM categories WHERE name = 'Organic Teas'), 'English Breakfast','Té Negro', 3.20, '', true, 10, 'English Breakfast',  'Black Tea',       'English Breakfast', 'Thé Noir');

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
