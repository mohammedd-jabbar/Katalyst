/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSnackbar } from "notistack";

import {
  productSchema,
  type ProductFormData,
} from "../components/ProductForm/schema";
import { getProductById, updateProduct } from "../../api/productsApi";
import { getCategories, getBrands, getStores } from "../../api/lookups.api";
import { fileToBase64 } from "../../../../lib/file/fileToBase64";

export default function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch product data
  const {
    data: product,
    isLoading: loadingProduct,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: !!id,
  });

  // Fetch lookups
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: brands = [], isLoading: loadingBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: stores = [], isLoading: loadingStores } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  // Watch select values
  const categoryId = watch("productCategoryId");
  const brandId = watch("brandId");
  const storeId = watch("storeId");

  // Populate form when product data loads
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || "",
        preferName: product.preferName || "",
        productCategoryId: product.productCategoryId || 0,
        brandId: product.brandId || 0,
        storeId: product.storeId || 0,
        oneMeasure: product.oneMeasure || "",
        smallMeasure: product.productMeasure || "",
        oneContains: product.oneContains || 1,
        mcPurchasePrice: product.mcPurchasePrice || 0,
        mcSellPrice: product.mcSellPrice || 0,
        mcSmallMeasureSellPrice: product.mcSmallMeasureSellPrice || 0,
        initialQte: product.initialQte ?? product.qteInStock ?? 0,
        alertQte: product.alertQte || 0,
        attachment: product.attachment || "",
      });
    }
  }, [product, reset]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => updateProduct(Number(id), data),
    onSuccess: () => {
      enqueueSnackbar("Product updated successfully!", { variant: "success" });
      navigate(`/products/${id}`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update product";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    try {
      setSelectedFile(file);
      const base64 = await fileToBase64(file);
      setValue("attachment", base64);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error ? error.message : "Failed to process file",
        { variant: "error" },
      );
      setSelectedFile(null);
    }
  };

  // Submit handler
  const onSubmit = (data: ProductFormData) => {
    if (!product) return;

    const payload = {
      // include identity fields
      id: product.id,
      barcode: product.barcode,

      // editable fields from form
      name: data.name,
      preferName: data.preferName,
      productCategoryId: data.productCategoryId,
      brandId: data.brandId,
      storeId: data.storeId,
      oneMeasure: data.oneMeasure,
      oneContains: data.oneContains,
      alertQte: data.alertQte,

      // API uses productMeasure (your form calls it smallMeasure)
      productMeasure: data.smallMeasure ?? product.productMeasure ?? "",

      // read-only fields MUST stay original
      initialQte: product.initialQte ?? data.initialQte ?? 0,
      mcPurchasePrice: product.mcPurchasePrice ?? data.mcPurchasePrice ?? 0,
      mcSellPrice: product.mcSellPrice ?? data.mcSellPrice ?? 0,
      mcSmallMeasureSellPrice:
        product.mcSmallMeasureSellPrice ?? data.mcSmallMeasureSellPrice ?? 0,

      // attachment: keep existing if no new file
      attachment: data.attachment || product.attachment || "",
    };

    updateMutation.mutate(payload as any);
  };

  const isLoading =
    loadingProduct || loadingCategories || loadingBrands || loadingStores;
  const isSubmitting = updateMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Alert severity="error">
          {(error as any)?.response?.data?.message ||
            "Product not found or failed to load"}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/products/${id}`)}
          sx={{ mb: 2 }}
        >
          Back to Details
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Edit Product
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update product information (some fields are read-only)
        </Typography>
      </Box>

      {/* Form */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("name")}
                  fullWidth
                  label="Product Name"
                  required
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("preferName")}
                  fullWidth
                  label="Preferred Name"
                  required
                  error={!!errors.preferName}
                  helperText={errors.preferName?.message}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Category, Brand, Store */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Classification
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl
                  fullWidth
                  error={!!errors.productCategoryId}
                  required
                >
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={categoryId || ""}
                    label="Category"
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setValue("productCategoryId", Number(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.productCategoryId && (
                    <FormHelperText>
                      {errors.productCategoryId.message}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.brandId} required>
                  <InputLabel>Brand</InputLabel>
                  <Select
                    value={brandId || ""}
                    label="Brand"
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setValue("brandId", Number(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>Select a brand</em>
                    </MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.brandId && (
                    <FormHelperText>{errors.brandId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth error={!!errors.storeId} required>
                  <InputLabel>Store</InputLabel>
                  <Select
                    value={storeId || ""}
                    label="Store"
                    disabled={isSubmitting}
                    onChange={(e) =>
                      setValue("storeId", Number(e.target.value), {
                        shouldValidate: true,
                      })
                    }
                  >
                    <MenuItem value="">
                      <em>Select a store</em>
                    </MenuItem>
                    {stores.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.title}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.storeId && (
                    <FormHelperText>{errors.storeId.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              {/* Measurements */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Measurements
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("oneMeasure")}
                  fullWidth
                  label="One Measure"
                  required
                  error={!!errors.oneMeasure}
                  helperText={errors.oneMeasure?.message}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("smallMeasure")}
                  fullWidth
                  label="Small Measure"
                  error={!!errors.smallMeasure}
                  helperText={errors.smallMeasure?.message}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("oneContains", { valueAsNumber: true })}
                  fullWidth
                  label="One Contains"
                  type="number"
                  required
                  error={!!errors.oneContains}
                  helperText={errors.oneContains?.message}
                  disabled={isSubmitting}
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>

              {/* Pricing (READ-ONLY in Edit Mode) */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Pricing
                  <Chip
                    label="Read-only in edit mode"
                    size="small"
                    sx={{ ml: 2 }}
                    color="warning"
                  />
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("mcPurchasePrice", { valueAsNumber: true })}
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  required
                  disabled={true} // ✅ DISABLED IN EDIT MODE
                  error={!!errors.mcPurchasePrice}
                  helperText={
                    errors.mcPurchasePrice?.message ||
                    "Cannot be changed in edit mode"
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("mcSellPrice", { valueAsNumber: true })}
                  fullWidth
                  label="Sell Price (Large)"
                  type="number"
                  required
                  disabled={true} // ✅ DISABLED IN EDIT MODE
                  error={!!errors.mcSellPrice}
                  helperText={
                    errors.mcSellPrice?.message ||
                    "Cannot be changed in edit mode"
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("mcSmallMeasureSellPrice", {
                    valueAsNumber: true,
                  })}
                  fullWidth
                  label="Sell Price (Small)"
                  type="number"
                  required
                  disabled={true} // ✅ DISABLED IN EDIT MODE
                  error={!!errors.mcSmallMeasureSellPrice}
                  helperText={
                    errors.mcSmallMeasureSellPrice?.message ||
                    "Cannot be changed in edit mode"
                  }
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              {/* Stock */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Stock Information
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("initialQte", { valueAsNumber: true })}
                  fullWidth
                  label="Initial Quantity"
                  type="number"
                  required
                  disabled={true} // ✅ DISABLED IN EDIT MODE
                  error={!!errors.initialQte}
                  helperText={
                    errors.initialQte?.message ||
                    "Cannot be changed in edit mode"
                  }
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("alertQte", { valueAsNumber: true })}
                  fullWidth
                  label="Alert Quantity"
                  type="number"
                  required
                  error={!!errors.alertQte}
                  helperText={errors.alertQte?.message}
                  disabled={isSubmitting}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              {/* Attachment */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Attachment
                </Typography>
              </Grid>

              <Grid size={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  disabled={isSubmitting}
                >
                  Replace File (Max 5MB)
                  <input
                    type="file"
                    hidden
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Chip
                    label={`${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`}
                    onDelete={() => setSelectedFile(null)}
                    sx={{ ml: 2 }}
                  />
                )}
                {!selectedFile && product.attachment && (
                  <Chip
                    label="Existing file will be kept"
                    sx={{ ml: 2 }}
                    variant="outlined"
                  />
                )}
              </Grid>

              {/* Actions */}
              <Grid size={12}>
                <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update Product"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(`/products/${id}`)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
