import { z } from "zod";

// Product form validation schema
export const productSchema = z.object({
  // Basic info
  name: z.string().min(1, "Product name is required"),
  preferName: z.string().min(1, "Preferred name is required"),

  // Relationships
  productCategoryId: z
    .number({
      required_error: "Category is required",
      invalid_type_error: "Category must be a number",
    })
    .min(1, "Please select a category"),
  brandId: z
    .number({
      required_error: "Brand is required",
      invalid_type_error: "Brand must be a number",
    })
    .min(1, "Please select a brand"),
  storeId: z
    .number({
      required_error: "Store is required",
      invalid_type_error: "Store must be a number",
    })
    .min(1, "Please select a store"),

  // Measurements
  oneMeasure: z.string().min(1, "One measure unit is required (e.g., 'Box')"),
  smallMeasure: z.string().optional(),
  oneContains: z
    .number({
      required_error: "One contains is required",
      invalid_type_error: "Must be a number",
    })
    .min(1, "One must contain at least 1 small unit"),

  // Pricing
  mcPurchasePrice: z
    .number({
      required_error: "Purchase price is required",
      invalid_type_error: "Must be a number",
    })
    .min(0, "Price cannot be negative"),
  mcSellPrice: z
    .number({
      required_error: "Sell price is required",
      invalid_type_error: "Must be a number",
    })
    .min(0, "Price cannot be negative"),
  mcSmallMeasureSellPrice: z
    .number({
      required_error: "Small measure sell price is required",
      invalid_type_error: "Must be a number",
    })
    .min(0, "Price cannot be negative"),

  // Stock
  initialQte: z
    .number({
      required_error: "Initial quantity is required",
      invalid_type_error: "Must be a number",
    })
    .min(0, "Quantity cannot be negative"),
  alertQte: z
    .number({
      required_error: "Alert quantity is required",
      invalid_type_error: "Must be a number",
    })
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
