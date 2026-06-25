-- ============================================================
-- PLENTY — Actualización carta COMIDA (Junio 2026)
-- Solo toca productos de categorías "food". Las bebidas no cambian.
-- Ejecutar en: Supabase → SQL Editor → New query → Run
-- ============================================================

-- 1. Eliminar solo los productos de comida
DELETE FROM products
WHERE category_id IN (SELECT id FROM categories WHERE menu = 'food');

-- ============================================================
-- 2. Re-insertar productos correctos por categoría
-- ============================================================

-- Signature Bowls
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Signature Bowls'), 'Granola Classic',  'Nuestra granola casera, yogur griego, miel',                                                            9.50, '', true, 1),
((SELECT id FROM categories WHERE name = 'Signature Bowls'), 'Chia Pudding',     'Chia pudding con leche de almendras, açaí + healthy toppings',                                         9.00, '', true, 2),
((SELECT id FROM categories WHERE name = 'Signature Bowls'), 'Açai Bliss',       'Pure de acai, mantequilla de cacahuete, nuestro granola, frutas & healthy toppings',                  11.50, '', true, 3);

-- Banana Bread (sin gluten disponible +€1,00)
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Dubái Style',     'Yogur, dip pistachio',                                                          6.50, '', true, 1),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Monkey',          'Yogur, chocolate caliente, banana, crema de pistachio & katafi',               6.50, '', true, 2),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Tayron',          'Yogur, caramelito salado, compota',                                             6.50, '', true, 3),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Playa',           'Yogur, coco, caramelito & chocolate',                                           6.50, '', true, 4),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Cheesecake Lotus','Yogur, salsa de cereza, chocolate blanco, melocotón, almendras',               6.50, '', true, 5),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Cherry Melba',    'Yogur, salsa de cereza, crema, melocotón, almendras',                           6.50, '', true, 6),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Simply',          'Mantequilla & canela',                                                          4.50, '', true, 7),
((SELECT id FROM categories WHERE name = 'Banana Bread'), 'Affogato BB',     'Banana Bread con helado de vainilla & espresso caliente',                       7.50, '', true, 8);

-- Pancakes
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Pancakes'), 'Quebec',    'Plátano, arándanos, nuestro granola & sirope de arce',          10.50, '', true, 1),
((SELECT id FROM categories WHERE name = 'Pancakes'), 'Maracuya',  'Maracuyá, frutas tropicales',                                   10.50, '', true, 2),
((SELECT id FROM categories WHERE name = 'Pancakes'), 'Pistachio', 'Virutas de mango, chocolate blanco, coco rallado, katafi',      10.50, '', true, 3),
((SELECT id FROM categories WHERE name = 'Pancakes'), 'Abuela',    'Compota de manzana, crema de mantequilla',                      10.50, '', true, 4);

-- Toasts (Oh My Eggs! pasa aquí desde Burgers)
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Toasts'), 'Hummus',      'Pan, hummus, feta de oveja, sésamo, kimchi y encurtidos de verduras caseros',  12.00, '', true, 1),
((SELECT id FROM categories WHERE name = 'Toasts'), 'Mango Bite',  'Pan, ricotta casera, chutney mango & bacon a la plancha',                      12.50, '', true, 2),
((SELECT id FROM categories WHERE name = 'Toasts'), 'Silky Smoke', 'Pan, aguacate, ricotta casera, salmón ahumado & semillas',                     13.00, '', true, 3),
((SELECT id FROM categories WHERE name = 'Toasts'), 'Sydney',      'Pan, aguacate, ricotta casera, semillas de calabaza',                          13.00, '', true, 4),
((SELECT id FROM categories WHERE name = 'Toasts'), 'Oh My Eggs!', 'Pan, aguacate, huevo pochado & salsa crujiente',                               10.00, '', true, 5);

-- Burgers
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Burgers'), 'Brekkie', 'Cheddar, huevo, bacon, cebolla caída & salsas BBQ', 12.50, '', true, 1),
((SELECT id FROM categories WHERE name = 'Burgers'), 'Nica',    'Pulled pork',                                       13.50, '', true, 2);

-- Garden Bowls (Vegé entra aquí desde Burgers)
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Garden Bowls'), 'Vegé',                        'Opción vegetariana del día',                                                                                               12.00, '', true, 1),
((SELECT id FROM categories WHERE name = 'Garden Bowls'), 'Ricotta Casera + Salmón Ahumado', 'Lechuga, pepino, edamame, tomates, rábanos, granola, salsa japonesa de sésamo & mini pitas',                         14.50, '', true, 2),
((SELECT id FROM categories WHERE name = 'Garden Bowls'), 'Salmón Ahumado',              'Lechuga, pepino, edamame, tomates, rábanos, granola, salsa japonesa de sésamo & mini pitas con salmón ahumado',         16.00, '', true, 3);

-- Extras
INSERT INTO products (category_id, name, description, price, image_url, available, "order") VALUES
((SELECT id FROM categories WHERE name = 'Extras'), 'Huevo frito o pochado',   '', 1.60, '', true, 1),
((SELECT id FROM categories WHERE name = 'Extras'), 'Feta DOP de oveja',       '', 1.50, '', true, 2),
((SELECT id FROM categories WHERE name = 'Extras'), 'Ricotta casera',          '', 2.50, '', true, 3),
((SELECT id FROM categories WHERE name = 'Extras'), 'Bacon a la plancha',      '', 2.00, '', true, 4),
((SELECT id FROM categories WHERE name = 'Extras'), 'Salmón ahumado',          '', 4.00, '', true, 5),
((SELECT id FROM categories WHERE name = 'Extras'), 'Mantequilla de cacahuete','', 1.50, '', true, 6),
((SELECT id FROM categories WHERE name = 'Extras'), 'Sirope de arce',          '', 2.50, '', true, 7);

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
