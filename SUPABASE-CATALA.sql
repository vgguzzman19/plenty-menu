-- ============================================================
-- PLENTY — Traduccions al Català (CA)
-- Executar a: Supabase → SQL Editor → New query → Run
-- ============================================================

-- ── CATEGORIES ───────────────────────────────────────────────
UPDATE categories SET name_ca = 'Bowls Signature'              WHERE name = 'Signature Bowls';
UPDATE categories SET name_ca = 'Pancakes'                     WHERE name = 'Pancakes';
UPDATE categories SET name_ca = 'Pa de Plàtan'                 WHERE name = 'Banana Bread';
UPDATE categories SET name_ca = 'Torrades'                     WHERE name = 'Toasts';
UPDATE categories SET name_ca = 'Hamburgueses'                 WHERE name = 'Burgers';
UPDATE categories SET name_ca = 'Bowls de l''Hort'             WHERE name = 'Garden Bowls';
UPDATE categories SET name_ca = 'Extres — Personalitza el teu brunch' WHERE name = 'Extras — Pimp your brunch';
UPDATE categories SET name_ca = 'Toppings Saludables'          WHERE name = 'Healthy Toppings';
UPDATE categories SET name_ca = 'Super Smoothies'              WHERE name = 'Super Smoothies';
UPDATE categories SET name_ca = 'Frappés Gelats'               WHERE name = 'Iced Frappés';
UPDATE categories SET name_ca = 'Lattes Gelats Casolans'       WHERE name = 'Homemade Iced Lattes';
UPDATE categories SET name_ca = 'Begudes Alcohòliques'         WHERE name = 'Alcoholic Drinks';
UPDATE categories SET name_ca = 'Refrescos'                    WHERE name = 'Soft Drinks';
UPDATE categories SET name_ca = 'Bar de Cafè'                  WHERE name = 'Coffee Bar';
UPDATE categories SET name_ca = 'Lattes Calents Casolans'      WHERE name = 'Homemade Hot Lattes';
UPDATE categories SET name_ca = 'Infusions Orgàniques'         WHERE name = 'Organic Teas';

-- ── SIGNATURE BOWLS ──────────────────────────────────────────
UPDATE products SET
  name_ca = 'Granola Classic',
  description_ca = 'El nostre granola, iogurt grec, mel, fruita i healthy toppings. Extra: Iogurt de coco +0,75€.'
WHERE name = 'Granola Classic';

UPDATE products SET
  name_ca = 'Chia Pudding',
  description_ca = 'Púding de chia amb llet d''ametlla, mel, coulis de gerds, fruites, el nostre granola i healthy toppings.'
WHERE name = 'Chia Pudding';

UPDATE products SET
  name_ca = 'Açai Bliss',
  description_ca = 'Puré d''açaí, mantequilla de cacauet, el nostre granola, fruites i healthy toppings.'
WHERE name = 'Açai Bliss';

-- ── PANCAKES ─────────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Quebec',
  description_ca = 'Plàtan, nabius, el nostre granola i xarop d''auró.'
WHERE name = 'Quebec';

UPDATE products SET
  name_ca = 'Maracuya',
  description_ca = 'Salsa de mango, xocolata blanca, coco ratllat i viruetes & el nostre granola.'
WHERE name = 'Maracuya';

UPDATE products SET
  name_ca = 'Pistacciu',
  description_ca = 'Xocolata calenta, crema de pistatxo, kataifi, pistatxos i rosa.'
WHERE name = 'Pistachio';

UPDATE products SET
  name_ca = 'Àvia',
  description_ca = 'Compota de poma, caramel de mantequilla salada, galeta digestive i canyella.'
WHERE name = 'Abuela';

-- ── BANANA BREAD ─────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Estil Dubai',
  description_ca = 'Iogurt, pistatxo, kataifi.'
WHERE name = 'Dubái Style';

UPDATE products SET
  name_ca = 'Monkey',
  description_ca = 'Iogurt, xocolata calenta, banana, coulis de maduixa i mantequilla de cacauet.'
WHERE name = 'Monkey';

UPDATE products SET
  name_ca = 'Tahití',
  description_ca = 'Iogurt, Nutella, plàtan, mantequilla de cacauet, granola i canyella.'
WHERE name = 'Tahití';

UPDATE products SET
  name_ca = 'Platja',
  description_ca = 'Iogurt, salsa de mango, xocolata blanca, coco i canyella a la taronja.'
WHERE name = 'Playa';

UPDATE products SET
  name_ca = 'Cheesecake Lotus',
  description_ca = 'Iogurt, salsa de Lotus, salsa de fruits vermells i Speculoos.'
WHERE name = 'Cheesecake Lotus';

UPDATE products SET
  name_ca = 'Cherry Melba',
  description_ca = 'Iogurt, salsa de cirera, xocolata blanca i préssec.'
WHERE name = 'Cherry Melba';

UPDATE products SET
  name_ca = 'Simply',
  description_ca = 'Calent, mantequilla i canyella.'
WHERE name = 'Simply';

UPDATE products SET
  name_ca = 'Affogato BB',
  description_ca = 'Pa de Plàtan amb gelat de vainilla i espresso calent.'
WHERE name = 'Affogato BB';

-- ── TOASTS ───────────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Hummus',
  description_ca = 'Pa, hummus, feta d''ovella, sèsam al kimchi i encurtits casolans.'
WHERE name = 'Hummus';

UPDATE products SET
  name_ca = 'Mango Bite',
  description_ca = 'Pa, ricotta casolana, xutney de mango & bacon a la planxa.'
WHERE name = 'Mango Bite';

UPDATE products SET
  name_ca = 'Silky Smoke',
  description_ca = 'Salmó fumat +4,00€, ricotta casolana, llavors de carbassa torrades & pebre fumat.'
WHERE name = 'Silky Smoke';

UPDATE products SET
  name_ca = 'Sydney',
  description_ca = 'Alvocat, ou escalpat & barreja cruixent de llavors.'
WHERE name = 'Sydney';

UPDATE products SET
  name_ca = 'Oh My Eggs!',
  description_ca = 'Pa amb 2 ous: escalpats o fregits.'
WHERE name = 'Oh My Eggs!';

-- ── BURGERS ──────────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Brekkie',
  description_ca = 'Cheddar, ou, bacon, ceba cuita & salsa BBQ.'
WHERE name = 'Brekkie';

UPDATE products SET
  name_ca = 'Nica',
  description_ca = 'Porc esmicolat, cheddar, maionesa fumada & duo de cebes.'
WHERE name = 'Nica';

-- ── GARDEN BOWLS ─────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Vegetal',
  description_ca = 'Enciam, edamame, tomàquets, raves, el nostre granola salat, salsa japonesa de sèsam & mini.'
WHERE name = 'Vegé';

UPDATE products SET
  name_ca = 'Ricotta Casolana + Salmó Fumat',
  description_ca = ''
WHERE name = 'Ricotta Casera + Salmón Ahumado';

UPDATE products SET
  name_ca = 'Salmó Fumat',
  description_ca = ''
WHERE name = 'Salmón Ahumado' AND category_id = (SELECT id FROM categories WHERE name = 'Garden Bowls');

-- ── EXTRAS ───────────────────────────────────────────────────
UPDATE products SET name_ca = 'Ou fregit o escalpat'    WHERE name = 'Huevo frito o pochado';
UPDATE products SET name_ca = 'Feta DOP d''ovella'      WHERE name = 'Feta DOP de oveja';
UPDATE products SET name_ca = 'Ricotta casolana'        WHERE name = 'Ricotta casera' AND category_id = (SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch');
UPDATE products SET name_ca = 'Bacon a la planxa'       WHERE name = 'Bacon a la plancha';
UPDATE products SET name_ca = 'Salmó fumat'             WHERE name = 'Salmón ahumado' AND category_id = (SELECT id FROM categories WHERE name = 'Extras — Pimp your brunch');
UPDATE products SET name_ca = 'Mantequilla de cacauet'  WHERE name = 'Mantequilla de cacahuete';
UPDATE products SET name_ca = 'Xarop d''auró'           WHERE name = 'Sirope de arce';

-- ── HEALTHY TOPPINGS ─────────────────────────────────────────
UPDATE products SET
  name_ca = 'Sense lactosa ✓',
  description_ca = 'Cobertures nutritives que aporten textura i sabor als teus plats al llarg de les estacions.'
WHERE name = 'Sin lactosa ✓';

UPDATE products SET name_ca = 'Sense gluten ✓' WHERE name = 'Sin gluten ✓';
UPDATE products SET name_ca = 'Vegà ✓'         WHERE name = 'Vegano ✓';

-- ── SUPER SMOOTHIES ──────────────────────────────────────────
UPDATE products SET name_ca = 'Pine Energy'    WHERE name = 'Pine Energy';
UPDATE products SET name_ca = 'Clean Detox'    WHERE name = 'Clean Detox';
UPDATE products SET name_ca = 'Purple Power'   WHERE name = 'Purple Power';
UPDATE products SET name_ca = 'Herbal Boost'   WHERE name = 'Herbal Boost';
UPDATE products SET name_ca = 'Red Roots'      WHERE name = 'Red Roots';
UPDATE products SET name_ca = 'Tum Tum Energy' WHERE name = 'Tum Tum Energy';
UPDATE products SET name_ca = 'Coco'           WHERE name = 'Coco';

-- ── ICED FRAPPÉS ─────────────────────────────────────────────
UPDATE products SET name_ca = 'Frappé de Xocolata' WHERE name = 'Chocolate Frappe';
UPDATE products SET name_ca = 'Frappé de Vainilla'  WHERE name = 'Vanilla Frappe';
UPDATE products SET name_ca = 'Frappé de Coco'      WHERE name = 'Coco Frappe';

-- ── HOMEMADE ICED LATTES ─────────────────────────────────────
UPDATE products SET name_ca = 'Espresso Tònic'    WHERE name = 'Espresso Tonic';
UPDATE products SET name_ca = 'Espresso Matcha'   WHERE name = 'Espresso Matcha';
UPDATE products SET name_ca = 'Espresso Affogato' WHERE name = 'Espresso Afogato';

-- ── COFFEE BAR ───────────────────────────────────────────────
UPDATE products SET name_ca = 'Doble Espresso'  WHERE name = 'Double Espresso';
UPDATE products SET name_ca = 'Americà'         WHERE name = 'Americano';
UPDATE products SET name_ca = 'Flat White'      WHERE name = 'Flat White';
UPDATE products SET name_ca = 'Cappuccino'      WHERE name = 'Cappuccino';
UPDATE products SET name_ca = 'Cafè amb Llet'   WHERE name = 'Café con Leche';

-- ── HOMEMADE HOT LATTES ──────────────────────────────────────
UPDATE products SET name_ca = 'Latte de Matcha'        WHERE name = 'Matcha Latte';
UPDATE products SET name_ca = 'Motion Latte'           WHERE name = 'Motion Latte';
UPDATE products SET name_ca = 'Latte de Pa de Plàtan'  WHERE name = 'Banana Bread Latte';
UPDATE products SET name_ca = 'Latte Toffee Nous Pecan' WHERE name = 'Toffee Pecan Latte';

-- ── ORGANIC TEAS ─────────────────────────────────────────────
UPDATE products SET
  name_ca = 'Infusió Orgànica',
  description_ca = 'Selecció d''infusions orgàniques de temporada.'
WHERE name = 'Organic Tea';

-- ── LECHE VEGETAL / SMOOTHIE UPGRADE ─────────────────────────
UPDATE products SET name_ca = 'Llet vegetal'          WHERE name = 'Leche vegetal';
UPDATE products SET name_ca = 'Millora de Smoothie'   WHERE name = 'Smoothie Upgrade';

-- ============================================================
-- FIN — verifica en Supabase → Table Editor → products
-- ============================================================
