import { z } from "zod";

/**
 * Product form validation schema
 *
 * Rules:
 * - All text fields required (name, preferredName, measures)
 * - Numeric fields must be positive
 * - Category, brand, store are required selections
 * - oneContains must be >= 1 (represents how many small units in one large unit)
 * - Attachment is optional
 */
export const productSchema = z.object({
  // Basic info
  name: z.string().min(1, "Product name is required"),
  preferName: z.string().min(1, "Preferred name is required"),

  // Relationships
  productCategoryId: z
    .number({ error: "Category is required" })
    .min(1, "Please select a category"),
  brandId: z
    .number({ error: "Brand is required" })
    .min(1, "Please select a brand"),
  storeId: z
    .number({ error: "Store is required" })
    .min(1, "Please select a store"),

  // Measurements
  oneMeasure: z.string().min(1, "One measure unit is required (e.g., 'Box')"),
  smallMeasure: z.string().optional(),
  oneContains: z
    .number({ error: "One contains is required" })
    .min(1, "One must contain at least 1 small unit"),

  // Pricing
  mcPurchasePrice: z
    .number({ error: "Purchase price is required" })
    .min(0, "Price cannot be negative"),
  mcSellPrice: z
    .number({ error: "Sell price is required" })
    .min(0, "Price cannot be negative"),
  mcSmallMeasureSellPrice: z
    .number({ error: "Small measure sell price is required" })
    .min(0, "Price cannot be negative"),

  // Stock
  initialQte: z
    .number({ error: "Initial quantity is required" })
    .min(0, "Quantity cannot be negative"),
  alertQte: z
    .number({ error: "Alert quantity is required" })
    .min(0, "Alert quantity cannot be negative"),

  // Attachment (optional)
  attachment: z.string().optional(),
});

/**
 * TypeScript type inferred from schema
 */
export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Schema for editing (some fields are read-only)
 */
export const productEditSchema = productSchema.partial({
  initialQte: true,
  mcPurchasePrice: true,
  mcSellPrice: true,
  mcSmallMeasureSellPrice: true,
});

export type ProductEditFormData = z.infer<typeof productEditSchema>;
