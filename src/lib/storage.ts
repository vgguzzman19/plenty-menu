import pool from "@/lib/db";

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: "admin" | "employee";
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  name_en?: string;
  name_fr?: string;
  name_ca?: string;
  emoji: string;
  order: number;
  menu: "food" | "drinks";
}

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  name_en?: string;
  description_en?: string;
  name_fr?: string;
  description_fr?: string;
  name_ca?: string;
  description_ca?: string;
  price: number;
  imageUrl: string;
  available: boolean;
  order: number;
  allergens: string[];
  badge?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    name_en: row.name_en ?? undefined,
    name_fr: row.name_fr ?? undefined,
    name_ca: row.name_ca ?? undefined,
    emoji: row.emoji,
    order: row.order,
    menu: row.menu ?? "food",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(row: any): Product {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    name_en: row.name_en ?? undefined,
    description_en: row.description_en ?? undefined,
    name_fr: row.name_fr ?? undefined,
    description_fr: row.description_fr ?? undefined,
    name_ca: row.name_ca ?? undefined,
    description_ca: row.description_ca ?? undefined,
    price: Number(row.price),
    imageUrl: row.image_url,
    available: row.available,
    order: row.order,
    allergens: Array.isArray(row.allergens) ? row.allergens : [],
    badge: row.badge ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
    active: row.active ?? true,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY "order"');
  return rows.map(mapCategory);
}

export async function getProducts(categoryId?: number): Promise<Product[]> {
  const { rows } = categoryId
    ? await pool.query('SELECT * FROM products WHERE category_id = $1 ORDER BY "order"', [categoryId])
    : await pool.query('SELECT * FROM products ORDER BY "order"');
  return rows.map(mapProduct);
}

export async function getUsers(): Promise<User[]> {
  const { rows } = await pool.query("SELECT * FROM users");
  return rows.map(mapUser);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function getUserById(id: number): Promise<User | undefined> {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function createUser(data: Omit<User, "id" | "active">): Promise<User> {
  const { rows } = await pool.query(
    "INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING *",
    [data.username, data.passwordHash, data.role]
  );
  return mapUser(rows[0]);
}

export async function setUserActive(id: number, active: boolean): Promise<User | null> {
  const { rows } = await pool.query(
    "UPDATE users SET active = $1 WHERE id = $2 RETURNING *",
    [active, id]
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function setUserPassword(id: number, passwordHash: string): Promise<User | null> {
  const { rows } = await pool.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *",
    [passwordHash, id]
  );
  return rows[0] ? mapUser(rows[0]) : null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const { rows } = await pool.query(
    `INSERT INTO categories (name, name_en, name_fr, name_ca, emoji, "order", menu)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [data.name, data.name_en, data.name_fr, data.name_ca, data.emoji, data.order, data.menu ?? "food"]
  );
  return mapCategory(rows[0]);
}

export async function updateCategory(id: number, data: Partial<Omit<Category, "id">>): Promise<Category | null> {
  const columns: Record<string, unknown> = {
    name: data.name,
    name_en: data.name_en,
    name_fr: data.name_fr,
    name_ca: data.name_ca,
    emoji: data.emoji,
    order: data.order,
    menu: data.menu,
  };

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  for (const [key, value] of Object.entries(columns)) {
    if (value === undefined) continue;
    const col = key === "order" ? '"order"' : key;
    fields.push(`${col} = $${i++}`);
    values.push(value);
  }

  if (fields.length === 0) {
    const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
    return rows[0] ? mapCategory(rows[0]) : null;
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE categories SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0] ? mapCategory(rows[0]) : null;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const { rows } = await pool.query(
    `INSERT INTO products
       (category_id, name, description, name_en, description_en, name_fr, description_fr,
        name_ca, description_ca, price, image_url, available, "order", allergens, badge)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     RETURNING *`,
    [
      data.categoryId,
      data.name,
      data.description,
      data.name_en,
      data.description_en,
      data.name_fr,
      data.description_fr,
      data.name_ca,
      data.description_ca,
      data.price,
      data.imageUrl,
      data.available,
      data.order,
      data.allergens ?? [],
      data.badge ?? null,
    ]
  );
  return mapProduct(rows[0]);
}

export async function updateProduct(id: number, data: Partial<Omit<Product, "id">>): Promise<Product | null> {
  const columns: Record<string, unknown> = {
    category_id: data.categoryId,
    name: data.name,
    description: data.description,
    name_en: data.name_en,
    description_en: data.description_en,
    name_fr: data.name_fr,
    description_fr: data.description_fr,
    name_ca: data.name_ca,
    description_ca: data.description_ca,
    price: data.price,
    image_url: data.imageUrl,
    available: data.available,
    order: data.order,
    allergens: data.allergens,
    badge: data.badge,
  };

  const fields: string[] = [];
  const values: unknown[] = [];
  let i = 1;
  for (const [key, value] of Object.entries(columns)) {
    if (value === undefined) continue;
    const col = key === "order" ? '"order"' : key;
    fields.push(`${col} = $${i++}`);
    values.push(value);
  }

  if (fields.length === 0) {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    return rows[0] ? mapProduct(rows[0]) : null;
  }

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE products SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
    values
  );
  return rows[0] ? mapProduct(rows[0]) : null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [id]);
  return (rowCount ?? 0) > 0;
}

export interface TableCall {
  id: number;
  tableNumber: number;
  createdAt: string;
  resolvedAt: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTableCall(row: any): TableCall {
  return {
    id: row.id,
    tableNumber: row.table_number,
    createdAt: row.created_at,
    resolvedAt: row.resolved_at,
  };
}

export async function createTableCall(tableNumber: number): Promise<TableCall> {
  const { rows } = await pool.query(
    "INSERT INTO table_calls (table_number) VALUES ($1) RETURNING *",
    [tableNumber]
  );
  return mapTableCall(rows[0]);
}

export async function getPendingTableCalls(): Promise<TableCall[]> {
  const { rows } = await pool.query(
    "SELECT * FROM table_calls WHERE resolved_at IS NULL ORDER BY created_at ASC"
  );
  return rows.map(mapTableCall);
}

export async function resolveTableCall(id: number): Promise<TableCall | null> {
  const { rows } = await pool.query(
    "UPDATE table_calls SET resolved_at = now() WHERE id = $1 RETURNING *",
    [id]
  );
  return rows[0] ? mapTableCall(rows[0]) : null;
}
