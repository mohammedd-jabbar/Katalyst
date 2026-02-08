/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
  Chip,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { getProductById } from "../../api/productsApi";
import { getCategories, getBrands, getStores } from "../../api/lookups.api";
import { formatMoney } from "../../../../lib/format/money";
import { formatDate } from "../../../../lib/format/date";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch product
  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(Number(id)),
    enabled: !!id,
  });

  // Fetch lookups to map IDs to names
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: getBrands,
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
  });

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

  // Map IDs to names
  const categoryName =
    product.productCategoryLabel ||
    categories.find((c) => c.id === product.productCategoryId)?.name ||
    "Unknown";
  const brandName =
    product.brandName ||
    brands.find((b) => b.id === product.brandId)?.name ||
    "Unknown";
  const storeName =
    stores.find((s) => s.id === product.storeId)?.title || "Unknown";

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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {product.name || "Unnamed Product"}
            </Typography>
            {product.preferName && (
              <Typography variant="body1" color="text.secondary">
                {product.preferName}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/products/${id}/edit`)}
          >
            Edit Product
          </Button>
        </Stack>
      </Box>

      {/* Product Details */}
      <Grid container spacing={3}>
        {/* General Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow label="Product Name" value={product.name} />
              <DetailRow label="Preferred Name" value={product.preferName} />
              <DetailRow label="Barcode" value={product.barcode} />
              <DetailRow
                label="Publishable"
                value={
                  <Chip
                    label={product.publishable ? "Yes" : "No"}
                    color={product.publishable ? "success" : "default"}
                    size="small"
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Classification */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Classification
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow label="Category" value={categoryName} />
              <DetailRow label="Brand" value={brandName} />
              <DetailRow label="Store" value={storeName} />
            </CardContent>
          </Card>
        </Grid>

        {/* Measurements */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Measurements
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow label="One Measure" value={product.oneMeasure} />
              <DetailRow label="Small Measure" value={product.productMeasure} />
              <DetailRow
                label="One Contains"
                value={
                  product.oneContains ? `${product.oneContains} units` : "N/A"
                }
              />
              <DetailRow
                label="Weight"
                value={product.weightInKg ? `${product.weightInKg} kg` : "N/A"}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pricing
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow
                label="Purchase Price"
                value={formatMoney(product.mcPurchasePrice || 0)}
              />
              <DetailRow
                label="Sell Price (Large)"
                value={formatMoney(product.mcSellPrice || 0)}
              />
              <DetailRow
                label="Sell Price (Small)"
                value={formatMoney(product.mcSmallMeasureSellPrice || 0)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stock Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow
                label="Current Stock"
                value={product.qteInStock || 0}
              />
              <DetailRow label="Alert Quantity" value={product.alertQte || 0} />
              <DetailRow
                label="Stock Status"
                value={
                  <Chip
                    label={
                      (product.qteInStock || 0) <= (product.alertQte || 0)
                        ? "Low Stock"
                        : "In Stock"
                    }
                    color={
                      (product.qteInStock || 0) <= (product.alertQte || 0)
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <DetailRow label="Product ID" value={product.id} />
              <DetailRow
                label="Created At"
                value={formatDate(product.createdAt)}
              />
              <DetailRow label="Last Modified By" value={product.lastUser} />
              {product.attachment && (
                <DetailRow
                  label="Attachment"
                  value={
                    <Chip
                      label="File Attached"
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  }
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Notes */}
        {product.note && (
          <Grid size={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Notes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body2">{product.note}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

/**
 * Reusable detail row component
 */
function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Box sx={{ mb: 1.5, display: "flex", justifyContent: "space-between" }}>
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value || "N/A"}
      </Typography>
    </Box>
  );
}
