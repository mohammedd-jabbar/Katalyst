import { http } from "../../../app/api";
import type { TProduct } from "../types/types";

/**
 * Product API endpoints
 */

export async function getProducts(): Promise<TProduct[]> {
  const res = await http.get<TProduct[]>("/products", {
    params: {
      _start: 0,
      _end: 100, // increase if needed
    },
  });

  return res.data;
}

export async function getProductById(id: number): Promise<TProduct> {
  const res = await http.get<TProduct>(`/products/${id}`);
  return res.data;
}

/**
 * Create product input type
 */
export interface CreateProductInput {
  name: string;
  preferName: string;
  productCategoryId: number;
  brandId: number;
  storeId: number;
  oneMeasure: string;
  smallMeasure?: string;
  oneContains: number;
  mcPurchasePrice: number;
  mcSellPrice: number;
  mcSmallMeasureSellPrice: number;
  initialQte: number;
  alertQte: number;
  attachment?: string; // Base64 string
}

/**
 * Create a new product
 */
export async function createProduct(
  data: CreateProductInput,
): Promise<TProduct> {
  const res = await http.post<TProduct>("/products", data);
  return res.data;
}

/**
 * Update existing product
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(id: number, data: any): Promise<TProduct> {
  const res = await http.put<TProduct>(`/products/${id}`, data);
  return res.data;
}

/**
 * Delete product (optional - if API supports it)
 */
export async function deleteProduct(id: number): Promise<void> {
  await http.delete(`/products/${id}`);
}
