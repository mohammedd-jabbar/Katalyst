import { http } from "../../../app/api";

/**
 * Lookup data types for form dropdowns
 */

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  lastUser?: string;
}

export interface Brand {
  id: number;
  name?: string;
  createdAt?: string;
  lastUser?: string;
}

export interface Store {
  id: number;
  title: string;
  createdAt?: string;
  lastUser?: string;
}

/**
 * Fetch all product categories
 */
export async function getCategories(): Promise<Category[]> {
  const res = await http.get<Category[]>("/ProductCategories");
  return res.data;
}

/**
 * Fetch all brands
 */
export async function getBrands(): Promise<Brand[]> {
  const res = await http.get<Brand[]>("/brands");
  return res.data;
}

/**
 * Fetch all stores
 */
export async function getStores(): Promise<Store[]> {
  const res = await http.get<Store[]>("/Stores");
  return res.data;
}
