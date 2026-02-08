/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";

import ProductsTable from "../components/ProductsTable";
import type { SortState } from "../../types/ProductTable.type";
import { useProductsQuery } from "../../api/products.queries";

function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ??
    err?.response?.data?.title ??
    err?.message ??
    "Failed to load products"
  );
}

export default function ProductsListPage() {
  const nav = useNavigate();
  const { data = [], isLoading, isError, error } = useProductsQuery();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({
    key: "createdAt",
    dir: "desc",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p) => {
      const haystack =
        `${p.name ?? ""} ${p.barcode ?? ""} ${p.brandName ?? ""} ${p.productCategoryLabel ?? ""}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [data, search]);

  const total = data.length;
  const showing = filtered.length;
  const draftCount = useMemo(
    () => filtered.filter((p) => !p.publishable).length,
    [filtered],
  );

  if (isLoading) {
    return (
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Loading products…
          </Typography>
        </Stack>
      </Paper>
    );
  }

  if (isError) {
    return <Alert severity="error">{getErrorMessage(error)}</Alert>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Header */}
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5" fontWeight={800} letterSpacing={-0.3}>
                Products
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search, view, and manage your products.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                size="small"
                placeholder="Search by name, barcode, brand..."
                InputProps={{
                  startAdornment: <SearchOutlinedIcon fontSize="small" />,
                }}
                sx={{ minWidth: { xs: "100%", sm: 340 } }}
              />

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => nav("/products/new")}
              >
                Create
              </Button>
            </Stack>
          </Stack>

          <Divider />

          {/* Quick stats */}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip label={`Total: ${total}`} variant="outlined" />
            <Chip
              label={`Showing: ${showing}`}
              color="primary"
              variant="outlined"
            />
            <Chip label={`Draft: ${draftCount}`} variant="outlined" />
          </Stack>
        </Stack>
      </Paper>

      {/* Table */}
      <ProductsTable
        rows={filtered}
        isLoading={false}
        error={null}
        sort={sort}
        onSortChange={setSort}
        onView={(id) => nav(`/products/${id}`)}
        onEdit={(id) => nav(`/products/${id}/edit`)}
      />
    </Box>
  );
}
