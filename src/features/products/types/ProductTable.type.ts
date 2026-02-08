import type { TProduct } from "./types";

export type SortDir = "asc" | "desc";
export type SortKey =
  | "name"
  | "barcode"
  | "productCategoryLabel"
  | "brandName"
  | "qteInStock"
  | "mcSellPrice"
  | "createdAt";

export type SortState = { key: SortKey; dir: SortDir };

// Minimal type used by the table.
// Matches the common fields from the API schema (ProductDto).

export type TProductsTable = {
  rows: TProduct[];
  isLoading?: boolean;
  error?: string | null;

  sort: SortState;
  onSortChange: (next: SortState) => void;

  onView: (id: number) => void;
  onEdit: (id: number) => void;
};
