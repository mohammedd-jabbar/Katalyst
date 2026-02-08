export interface TBrand {
  id?: number;
  name?: string;
  createdAt?: string; // ISO date string
  lastUser?: string;
}

export interface TProduct {
  id: number;
  storeProductId?: number;
  barcode?: string;
  barcode1?: string;
  barcode2?: string;
  barcode3?: string;
  barcode4?: string;
  barcode5?: string;
  barcode6?: string;
  barcode7?: string;
  barcode8?: string;
  barcode9?: string;
  name?: string;
  preferName?: string;
  publishable?: boolean;
  nameEn?: string;
  preferNameEn?: string;
  nameAr?: string;
  preferNameAr?: string;
  shortDescription?: string;
  longDescription?: string;
  productMeasure?: string;
  oneContains?: number;
  weightInKg?: number;
  oneMeasure?: string;
  attachment?: string;
  type?: string;
  productCategoryId?: number;
  productCategoryLabel?: string;
  brandId?: number;
  brandName?: string;
  brand?: TBrand;
  rank?: number;
  color?: string;
  xlength?: number;
  ylength?: number;
  zlength?: number;
  note?: string;
  storeId?: number;
  mcPurchasePrice?: number;
  scPurchasePrice?: number;
  purchaseByMain?: boolean;
  mcSellPrice?: number;
  scSellPrice?: number;
  sellByMain?: boolean;
  qteInStock?: number;
  alertQte?: number;
  productionDate?: string; // ISO date string
  expireDate?: string; // ISO date string
  mcDiscount?: number;
  scDiscount?: number;
  mcCashBackPerUnit?: number;
  scCashBackPerUnit?: number;
  canSellBellowZero?: boolean;
  profitRate?: number;
  mcSmallMeasureSellPrice?: number;
  scSmallMeasureSellPrice?: number;
  smallMeasureQte?: number;
  lastUser?: string;
  createdAt?: string; // ISO date string
  ignoreStock?: boolean;
  casherPriceChangeable?: boolean;
  mcSellMinPrice?: number;
  scSellMinPrice?: number;
  mcSellMaxPrice?: number;
  scSellMaxPrice?: number;
  supplierId: number;

  // Initial Values
  initialQte?: number;
  initialSmallMeasureQte?: number;
  isActive: boolean;
}
