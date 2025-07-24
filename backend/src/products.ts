import pool from './db';
import { Product } from './db-schema';

export async function getAllProducts(): Promise<Product[]> {
  const { rows } = await pool.query('SELECT * FROM app_schema.products ORDER BY created_at DESC');
  return rows;
}

export async function getProductById(id: number): Promise<Product | null> {
  const { rows } = await pool.query('SELECT * FROM app_schema.products WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { user_id, title, description, price } = product;
  const { rows } = await pool.query(
    `INSERT INTO app_schema.products (user_id, title, description, price) VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, title, description, price]
  );
  return rows[0];
}

export async function updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'created_at'>>): Promise<Product | null> {
  const fields = Object.keys(product);
  if (fields.length === 0) return null;
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = [id, ...fields.map(f => (product as any)[f])];
  const { rows } = await pool.query(
    `UPDATE app_schema.products SET ${setClause} WHERE id = $1 RETURNING *`,
    values
  );
  return rows[0] || null;
}

export async function deleteProduct(id: number): Promise<boolean> {
  const { rowCount } = await pool.query('DELETE FROM app_schema.products WHERE id = $1', [id]);
  return (rowCount ?? 0) > 0;
}
