-- ============================================================
-- PLENTY — Carta COMIDA completa y correcta (Junio 2026)
-- Incluye nombres, descripciones, precios y traducciones EN+FR
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── 1. ACTUALIZAR ORDEN Y NOMBRES DE CATEGORÍAS ──────────────
UPDATE categories SET "order" = 1 WHERE name = 'Signature Bowls' AND menu = 'food';
UPDATE categories SET "order" = 2 WHERE name = 'Pancakes'        AND menu = 'food';
UPDATE categories SET "order" = 3 WHERE name = 'Banana Bread'    AND menu = 'food';
UPDATE categories SET "order" = 4 WHERE name = 'Toasts'          AND menu = 'food';
UPDATE categories SET "order" = 5 WHERE name = 'Burgers'         AND menu = 'food';
UPDATE categories SET "order" = 6 WHERE name = 'Garden Bowls'    AND menu = 'food';
UPDATE categories SET name = 'Extras — Pimp your brunch', "order" = 7
  WHERE (name = 'Extras' OR name = 'Extras — Pimp your brunch') AND menu = 'food';

-- ── 2. AÑADIR CATEGORÍA "HEALTHY TOPPINGS" SI NO EXISTE ──────
INSERT INTO categories (name, emoji, "order", menu)
SELECT 'Healthy Toppings', '🌿', 8, 'food'
WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Healthy Toppings' AND menu = 'food');

-- ── 3. BORRAR TODOS LOS PRODUCTOS DE COMIDA ──────────────────
DELETE FROM products WHERE category_id IN (SELECT id FROM categories WHERE menu = 'food');

-- ── 4. REINSERTAR CON DATOS CORRECTOS ────────────────────────

-- ══ SIGNATURE BOWLS ══════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Signature Bowls'),
 'Granola Classic',
 'Nuestro granola, yogur griego, miel, fruta y healthy toppings. Extra: Yogur de coco +0,75€.',
 9.50, '', true, 1,
 'Granola Classic',
 'Our granola, Greek yogurt, honey, fruit and healthy toppings. Extra: Coconut yogurt +€0.75.',
 'Granola Classic',
 'Notre granola, yaourt grec, miel, fruits et healthy toppings. Extra : Yaourt coco +0,75€.'),

((SELECT id FROM categories WHERE name = 'Signature Bowls'),
 'Chia Pudding',
 'Chía pudding con leche de almendras, miel, coulis de frambuesa, frutas, nuestro granola y healthy toppings.',
 9.00, '', true, 2,
 'Chia Pudding',
 'Chia pudding with almond milk, honey, raspberry coulis, fruits, our granola and healthy toppings.',
 'Chia Pudding',
 'Pudding de chia au lait d''amande, miel, coulis de framboise, fruits, notre granola et healthy toppings.'),

((SELECT id FROM categories WHERE name = 'Signature Bowls'),
 'Açai Bliss',
 'Puré de açaí, mantequilla de cacahuete, nuestro granola, frutas y healthy toppings.',
 11.50, '', true, 3,
 'Açai Bliss',
 'Açaí purée, peanut butter, our granola, fruits and healthy toppings.',
 'Açai Bliss',
 'Purée d''açaï, beurre de cacahuète, notre granola, fruits et healthy toppings.');

-- ══ PANCAKES ═════════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Pancakes'),
 'Quebec',
 'Plátano, arándanos, nuestro granola y sirope de arce.',
 10.50, '', true, 1,
 'Quebec',
 'Banana, blueberries, our granola and maple syrup.',
 'Québec',
 'Banane, myrtilles, notre granola et sirop d''érable.'),

((SELECT id FROM categories WHERE name = 'Pancakes'),
 'Maracuya',
 'Salsa de mango, chocolate blanco, coco rallado y virutas & nuestro granola.',
 10.50, '', true, 2,
 'Maracuya',
 'Mango sauce, white chocolate, grated coconut shavings & our granola.',
 'Maracuya',
 'Sauce mangue, chocolat blanc, noix de coco râpée & notre granola.'),

((SELECT id FROM categories WHERE name = 'Pancakes'),
 'Pistachio',
 'Chocolate caliente, crema de pistacho, kataifi, pistachos y rosa.',
 10.50, '', true, 3,
 'Pistachio',
 'Hot chocolate, pistachio cream, kataifi, pistachios and rose.',
 'Pistache',
 'Chocolat chaud, crème pistache, kataifi, pistaches et rose.'),

((SELECT id FROM categories WHERE name = 'Pancakes'),
 'Abuela',
 'Compota de manzana, caramelo de mantequilla salada, galleta digestive y canela.',
 10.50, '', true, 4,
 'Grandma''s',
 'Apple compote, salted butter caramel, digestive biscuit and cinnamon.',
 'Grand-mère',
 'Compote de pomme, caramel au beurre salé, biscuit digestive et cannelle.');

-- ══ BANANA BREAD ═════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Dubái Style',
 'Yogur, pistacho, kataifi.',
 6.50, '', true, 1,
 'Dubai Style',
 'Yogurt, pistachio, kataifi.',
 'Style Dubaï',
 'Yaourt, pistache, kataifi.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Monkey',
 'Yogur, chocolate caliente, banana, coulis de fresa y mantequilla de cacahuete.',
 6.50, '', true, 2,
 'Monkey',
 'Yogurt, hot chocolate, banana, strawberry coulis and peanut butter.',
 'Monkey',
 'Yaourt, chocolat chaud, banane, coulis de fraise et beurre de cacahuète.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Tahití',
 'Yogur, Nutella, plátano, mantequilla de cacahuete, granola y canela.',
 6.50, '', true, 3,
 'Tahiti',
 'Yogurt, Nutella, banana, peanut butter, granola and cinnamon.',
 'Tahiti',
 'Yaourt, Nutella, banane, beurre de cacahuète, granola et cannelle.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Playa',
 'Yogur, salsa de mango, chocolate blanco, coco y canela a la naranja.',
 6.50, '', true, 4,
 'Playa',
 'Yogurt, mango sauce, white chocolate, coconut and orange cinnamon.',
 'Playa',
 'Yaourt, sauce mangue, chocolat blanc, coco et cannelle à l''orange.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Cheesecake Lotus',
 'Yogur, salsa de Lotus, salsa de frutos rojos y Speculoos.',
 6.50, '', true, 5,
 'Cheesecake Lotus',
 'Yogurt, Lotus sauce, red berries sauce and Speculoos.',
 'Cheesecake Lotus',
 'Yaourt, sauce Lotus, sauce fruits rouges et Spéculoos.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Cherry Melba',
 'Yogur, salsa de cereza, chocolate blanco y melocotón.',
 6.50, '', true, 6,
 'Cherry Melba',
 'Yogurt, cherry sauce, white chocolate and peach.',
 'Cherry Melba',
 'Yaourt, sauce cerise, chocolat blanc et pêche.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Simply',
 'Caliente, mantequilla y canela.',
 4.50, '', true, 7,
 'Simply',
 'Warm, butter and cinnamon.',
 'Simply',
 'Chaud, beurre et cannelle.'),

((SELECT id FROM categories WHERE name = 'Banana Bread'),
 'Affogato BB',
 'Banana Bread con helado de vainilla y espresso caliente.',
 7.50, '', true, 8,
 'Affogato BB',
 'Banana Bread with vanilla ice cream and hot espresso.',
 'Affogato BB',
 'Banana Bread avec glace vanille et espresso chaud.');

-- ══ TOASTS ═══════════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Toasts'),
 'Hummus',
 'Pan, hummus, feta de oveja, sésamo al kimchi y encurtidos caseros.',
 12.00, '', true, 1,
 'Hummus',
 'Bread, hummus, sheep''s feta, kimchi sesame and homemade pickles.',
 'Houmous',
 'Pain, houmous, feta de brebis, sésame kimchi et pickles maison.'),

((SELECT id FROM categories WHERE name = 'Toasts'),
 'Mango Bite',
 'Pan, ricotta casera, chutney mango & bacon a la plancha.',
 12.50, '', true, 2,
 'Mango Bite',
 'Bread, homemade ricotta, mango chutney & grilled bacon.',
 'Mango Bite',
 'Pain, ricotta maison, chutney mangue & bacon grillé.'),

((SELECT id FROM categories WHERE name = 'Toasts'),
 'Silky Smoke',
 'Salmón ahumado +4,00€, ricotta casera, semillas de calabaza tostadas & pimienta ahumada.',
 13.00, '', true, 3,
 'Silky Smoke',
 'Smoked salmon +€4.00, homemade ricotta, toasted pumpkin seeds & smoked pepper.',
 'Silky Smoke',
 'Saumon fumé +4,00€, ricotta maison, graines de courge grillées & poivre fumé.'),

((SELECT id FROM categories WHERE name = 'Toasts'),
 'Sydney',
 'Aguacate, huevo poché & mixto crujiente de semillas.',
 13.00, '', true, 4,
 'Sydney',
 'Avocado, poached egg & crunchy seed mix.',
 'Sydney',
 'Avocat, œuf poché & mélange croustillant de graines.'),

((SELECT id FROM categories WHERE name = 'Toasts'),
 'Oh My Eggs!',
 'Pan con 2 huevos: pochés o fritos.',
 10.00, '', true, 5,
 'Oh My Eggs!',
 'Bread with 2 eggs: poached or fried.',
 'Oh My Eggs!',
 'Pain avec 2 œufs : pochés ou frits.');

-- ══ BURGERS ══════════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Burgers'),
 'Brekkie',
 'Cheddar, huevo, bacon, cebolla cocida & salsa BBQ.',
 12.50, '', true, 1,
 'Brekkie',
 'Cheddar, egg, bacon, cooked onion & BBQ sauce.',
 'Brekkie',
 'Cheddar, œuf, bacon, oignon cuit & sauce BBQ.'),

((SELECT id FROM categories WHERE name = 'Burgers'),
 'Nica',
 'Pulled pork, cheddar, mayo ahumada & dúo de cebollas.',
 13.50, '', true, 2,
 'Nica',
 'Pulled pork, cheddar, smoked mayo & onion duo.',
 'Nica',
 'Porc effiloché, cheddar, mayo fumée & duo d''oignons.');

-- ══ GARDEN BOWLS ═════════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Garden Bowls'),
 'Vegé',
 'Lechuga, edamame, tomates, rábanos, nuestro granola salado, salsa japonesa de sésamo & mini.',
 12.00, '', true, 1,
 'Veggie',
 'Lettuce, edamame, tomatoes, radishes, our savoury granola, Japanese sesame sauce & mini.',
 'Veggie',
 'Laitue, edamame, tomates, radis, notre granola salé, sauce sésame japonaise & mini.'),

((SELECT id FROM categories WHERE name = 'Garden Bowls'),
 'Ricotta Casera + Salmón Ahumado',
 '',
 14.50, '', true, 2,
 'Homemade Ricotta + Smoked Salmon',
 '',
 'Ricotta Maison + Saumon Fumé',
 ''),

((SELECT id FROM categories WHERE name = 'Garden Bowls'),
 'Salmón Ahumado',
 '',
 16.00, '', true, 3,
 'Smoked Salmon',
 '',
 'Saumon Fumé',
 '');

-- ══ EXTRAS — PIMP YOUR BRUNCH ════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Huevo frito o pochado', '', 1.60, '', true, 1,
 'Fried or poached egg', '', 'Œuf frit ou poché', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Feta DOP de oveja', '', 2.50, '', true, 2,
 'Sheep''s DOP Feta', '', 'Feta DOP de brebis', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Ricotta casera', '', 2.50, '', true, 3,
 'Homemade ricotta', '', 'Ricotta maison', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Bacon a la plancha', '', 2.00, '', true, 4,
 'Grilled bacon', '', 'Bacon grillé', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Salmón ahumado', '', 4.00, '', true, 5,
 'Smoked salmon', '', 'Saumon fumé', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Mantequilla de cacahuete', '', 1.50, '', true, 6,
 'Peanut butter', '', 'Beurre de cacahuète', ''),

((SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch'),
 'Sirope de arce', '', 2.50, '', true, 7,
 'Maple syrup', '', 'Sirop d''érable', '');

-- ══ HEALTHY TOPPINGS ═════════════════════════════════════════
INSERT INTO products (category_id, name, description, price, image_url, available, "order", name_en, description_en, name_fr, description_fr) VALUES

((SELECT id FROM categories WHERE name = 'Healthy Toppings'),
 'Sin lactosa ✓', 'Coberturas nutritivas que aportan textura y sabor a tus platos a lo largo de las estaciones.', 0.00, '', true, 1,
 'Dairy-free ✓', 'Nutritious toppings that add texture and flavour to your dishes throughout the seasons.', 'Sans lactose ✓', 'Garnitures nutritives qui apportent texture et saveur à vos plats au fil des saisons.'),

((SELECT id FROM categories WHERE name = 'Healthy Toppings'),
 'Sin gluten ✓', '', 0.00, '', true, 2,
 'Gluten-free ✓', '', 'Sans gluten ✓', ''),

((SELECT id FROM categories WHERE name = 'Healthy Toppings'),
 'Vegano ✓', '', 0.00, '', true, 3,
 'Vegan ✓', '', 'Vegan ✓', '');

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
