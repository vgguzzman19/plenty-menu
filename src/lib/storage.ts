import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      fetch: (url, options = {}) =>
        fetch(url, { ...options, cache: "no-store" }),
    },
  }
);

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: "admin";
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
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapUser(row: any): User {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash,
    role: row.role,
  };
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order");
  if (error) throw error;
  return (data ?? []).map(mapCategory);
}

export async function getProducts(categoryId?: number): Promise<Product[]> {
  let query = supabase.from("products").select("*").order("order");
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapProduct);
}

export async function getUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*");
  if (error) throw error;
  return (data ?? []).map(mapUser);
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  return data ? mapUser(data) : undefined;
}

export async function createUser(data: Omit<User, "id">): Promise<User> {
  const { data: row, error } = await supabase
    .from("users")
    .insert({ username: data.username, password_hash: data.passwordHash, role: data.role })
    .select()
    .single();
  if (error) throw error;
  return mapUser(row);
}

export async function createCategory(data: Omit<Category, "id">): Promise<Category> {
  const { data: row, error } = await supabase
    .from("categories")
    .insert({
      name: data.name,
      name_en: data.name_en,
      name_fr: data.name_fr,
      name_ca: data.name_ca,
      emoji: data.emoji,
      order: data.order,
      menu: data.menu ?? "food",
    })
    .select()
    .single();
  if (error) throw error;
  return mapCategory(row);
}

export async function updateCategory(id: number, data: Partial<Omit<Category, "id">>): Promise<Category | null> {
  const update: Record<string, unknown> = {};
  if (data.name !== undefined) update.name = data.name;
  if (data.name_en !== undefined) update.name_en = data.name_en;
  if (data.name_fr !== undefined) update.name_fr = data.name_fr;
  if (data.name_ca !== undefined) update.name_ca = data.name_ca;
  if (data.emoji !== undefined) update.emoji = data.emoji;
  if (data.order !== undefined) update.order = data.order;
  if (data.menu !== undefined) update.menu = data.menu;

  const { data: row, error } = await supabase
    .from("categories")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return row ? mapCategory(row) : null;
}

export async function deleteCategory(id: number): Promise<boolean> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  return !error;
}

export async function createProduct(data: Omit<Product, "id">): Promise<Product> {
  const { data: row, error } = await supabase
    .from("products")
    .insert({
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
      allergens: data.allergens ?? [],
    })
    .select()
    .single();
  if (error) throw error;
  return mapProduct(row);
}

export async function updateProduct(id: number, data: Partial<Omit<Product, "id">>): Promise<Product | null> {
  const update: Record<string, unknown> = {};
  if (data.categoryId !== undefined) update.category_id = data.categoryId;
  if (data.name !== undefined) update.name = data.name;
  if (data.description !== undefined) update.description = data.description;
  if (data.name_en !== undefined) update.name_en = data.name_en;
  if (data.description_en !== undefined) update.description_en = data.description_en;
  if (data.name_fr !== undefined) update.name_fr = data.name_fr;
  if (data.description_fr !== undefined) update.description_fr = data.description_fr;
  if (data.name_ca !== undefined) update.name_ca = data.name_ca;
  if (data.description_ca !== undefined) update.description_ca = data.description_ca;
  if (data.price !== undefined) update.price = data.price;
  if (data.imageUrl !== undefined) update.image_url = data.imageUrl;
  if (data.available !== undefined) update.available = data.available;
  if (data.order !== undefined) update.order = data.order;
  if (data.allergens !== undefined) update.allergens = data.allergens;

  const { data: row, error } = await supabase
    .from("products")
    .update(update)
    .eq("id", id)
    .select()
    .single();
  if (error) return null;
  return row ? mapProduct(row) : null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  return !error;
}
