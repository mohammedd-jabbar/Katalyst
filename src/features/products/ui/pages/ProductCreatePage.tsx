/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Grid,
  Select,
  TextField,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useSnackbar } from "notistack";

import { productSchema, type ProductFormData } from "../components/schema";
import { createProduct } from "../../api/productsApi";
import { getCategories, getBrands, getStores } from "../../api/lookups.api";
import { fileToBase64 } from "../../../../lib/file/fileToBase64";

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch lookups for dropdowns
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
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      preferName: "",
      productCategoryId: 0,
      brandId: 0,
      storeId: 0,
      oneMeasure: "",
      smallMeasure: "",
      oneContains: 1,
      mcPurchasePrice: 0,
      mcSellPrice: 0,
      mcSmallMeasureSellPrice: 0,
      initialQte: 0,
      alertQte: 0,
    },
  });

  // Watch select values
  const categoryId = watch("productCategoryId");
  const brandId = watch("brandId");
  const storeId = watch("storeId");

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      enqueueSnackbar("Product created successfully!", { variant: "success" });
      navigate(`/products/${data.id}`);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create product";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      setValue("attachment", "");
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
      setValue("attachment", "");
    }
  };

  // Submit handler
  const onSubmit = async (data: ProductFormData) => {
    createMutation.mutate(data);
  };

  const isLoading = loadingCategories || loadingBrands || loadingStores;
  const isSubmitting = createMutation.isPending;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/products")}
          sx={{ mb: 2 }}
        >
          Back to Products
        </Button>
        <Typography variant="h4" fontWeight={700}>
          Create New Product
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fill in the details below to add a new product to your inventory
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
                        {store.name}
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
                  label="One Measure (e.g., Box, Carton)"
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
                  label="Small Measure (e.g., Piece, Unit)"
                  error={!!errors.smallMeasure}
                  helperText={errors.smallMeasure?.message}
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("oneContains", { valueAsNumber: true })}
                  fullWidth
                  label="One Contains (how many small units)"
                  type="number"
                  required
                  error={!!errors.oneContains}
                  helperText={errors.oneContains?.message}
                  disabled={isSubmitting}
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>

              {/* Pricing */}
              <Grid size={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Pricing
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  {...register("mcPurchasePrice", { valueAsNumber: true })}
                  fullWidth
                  label="Purchase Price"
                  type="number"
                  required
                  error={!!errors.mcPurchasePrice}
                  helperText={errors.mcPurchasePrice?.message}
                  disabled={isSubmitting}
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
                  error={!!errors.mcSellPrice}
                  helperText={errors.mcSellPrice?.message}
                  disabled={isSubmitting}
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
                  error={!!errors.mcSmallMeasureSellPrice}
                  helperText={errors.mcSmallMeasureSellPrice?.message}
                  disabled={isSubmitting}
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
                  error={!!errors.initialQte}
                  helperText={errors.initialQte?.message}
                  disabled={isSubmitting}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  {...register("alertQte", { valueAsNumber: true })}
                  fullWidth
                  label="Alert Quantity (Low Stock Warning)"
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
                  Attachment (Optional)
                </Typography>
              </Grid>

              <Grid size={12}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<AttachFileIcon />}
                  disabled={isSubmitting}
                >
                  Choose File (Max 5MB)
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
                {selectedFile && (
                  <Chip
                    label={`${selectedFile.name} (${(selectedFile.size / 1024).toFixed(0)} KB)`}
                    onDelete={() => {
                      setSelectedFile(null);
                      setValue("attachment", "");
                    }}
                    sx={{ ml: 2 }}
                  />
                )}
                {errors.attachment && (
                  <FormHelperText error>
                    {errors.attachment.message}
                  </FormHelperText>
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
                    {isSubmitting ? "Creating..." : "Create Product"}
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate("/products")}
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
