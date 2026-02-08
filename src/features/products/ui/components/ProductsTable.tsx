/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Alert,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import type { SortKey, TProductsTable } from "../../types/ProductTable.type";
import { formatMoney } from "../../../../lib/format/money";
import type { TProduct } from "../../types/types";

function getErrorMessage(err: any) {
  return (
    err?.response?.data?.message ??
    err?.response?.data?.title ??
    err?.message ??
    "Request failed"
  );
}

function compare(a: TProduct, b: TProduct, key: SortKey) {
  const av = (a as any)[key];
  const bv = (b as any)[key];

  if (key === "createdAt") {
    const at = av ? new Date(av).getTime() : 0;
    const bt = bv ? new Date(bv).getTime() : 0;
    return at - bt;
  }

  if (typeof av === "number" || typeof bv === "number") {
    return (Number(av ?? 0) || 0) - (Number(bv ?? 0) || 0);
  }

  return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
    sensitivity: "base",
  });
}

function formatCreated(iso?: string | null) {
  if (!iso) return { date: "—", time: "" };
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: "—", time: "" };

  return {
    date: d.toLocaleDateString(),
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
}

export default function ProductsTable({
  rows,
  isLoading = false,
  error = null,
  sort,
  onSortChange,
  onView,
  onEdit,
}: TProductsTable) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  React.useEffect(() => setPage(0), [rows.length]);

  const sortedRows = React.useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const diff = compare(a, b, sort.key);
      return sort.dir === "asc" ? diff : -diff;
    });
    return copy;
  }, [rows, sort]);

  const paged = React.useMemo(() => {
    const start = page * rowsPerPage;
    return sortedRows.slice(start, start + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const requestSort = (key: SortKey) => {
    onSortChange({
      key,
      dir: sort.key === key ? (sort.dir === "asc" ? "desc" : "asc") : "asc",
    });
  };

  return (
    <Paper variant="outlined">
      {error ? (
        <Box sx={{ p: 2 }}>
          <Alert severity="error">{getErrorMessage(error)}</Alert>
        </Box>
      ) : null}

      <TableContainer sx={{ maxHeight: 680 }}>
        <Table
          stickyHeader
          size="small"
          sx={{ tableLayout: "fixed" }}
          aria-label="products table"
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, width: 420 }}>
                <TableSortLabel
                  active={sort.key === "name"}
                  direction={sort.key === "name" ? sort.dir : "asc"}
                  onClick={() => requestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 800, width: 170 }}>
                <TableSortLabel
                  active={sort.key === "barcode"}
                  direction={sort.key === "barcode" ? sort.dir : "asc"}
                  onClick={() => requestSort("barcode")}
                >
                  Barcode
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 800, width: 180 }}>
                <TableSortLabel
                  active={sort.key === "productCategoryLabel"}
                  direction={
                    sort.key === "productCategoryLabel" ? sort.dir : "asc"
                  }
                  onClick={() => requestSort("productCategoryLabel")}
                >
                  Category
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 800, width: 160 }}>
                <TableSortLabel
                  active={sort.key === "brandName"}
                  direction={sort.key === "brandName" ? sort.dir : "asc"}
                  onClick={() => requestSort("brandName")}
                >
                  Brand
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 800, width: 90 }}>
                <TableSortLabel
                  active={sort.key === "qteInStock"}
                  direction={sort.key === "qteInStock" ? sort.dir : "asc"}
                  onClick={() => requestSort("qteInStock")}
                >
                  Stock
                </TableSortLabel>
              </TableCell>

              <TableCell align="right" sx={{ fontWeight: 800, width: 130 }}>
                <TableSortLabel
                  active={sort.key === "mcSellPrice"}
                  direction={sort.key === "mcSellPrice" ? sort.dir : "asc"}
                  onClick={() => requestSort("mcSellPrice")}
                >
                  Sell
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 800, width: 150 }}>
                <TableSortLabel
                  active={sort.key === "createdAt"}
                  direction={sort.key === "createdAt" ? sort.dir : "asc"}
                  onClick={() => requestSort("createdAt")}
                >
                  Created
                </TableSortLabel>
              </TableCell>

              <TableCell sx={{ fontWeight: 800, width: 110 }}>Status</TableCell>

              <TableCell align="right" sx={{ fontWeight: 800, width: 110 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              "& tr:nth-of-type(odd)": { bgcolor: "action.hover" },
              "& tr:hover td": { bgcolor: "action.selected" },
              cursor: "pointer",
            }}
          >
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton height={22} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ py: 6, textAlign: "center" }}>
                    <Typography variant="subtitle1" fontWeight={800}>
                      No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Try adjusting your search.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((p) => {
                const created = formatCreated(p.createdAt ?? null);
                return (
                  <TableRow
                    hover
                    key={p.id}
                    onClick={() => onView(p.id)}
                    sx={{ "& td": { whiteSpace: "nowrap" } }}
                  >
                    <TableCell sx={{ maxWidth: 420 }}>
                      <Tooltip title={p.name ?? ""} placement="top-start" arrow>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          noWrap
                          dir="auto"
                          sx={{ maxWidth: 420 }}
                        >
                          {p.name ?? "—"}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell
                      sx={{
                        fontFamily:
                          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      }}
                    >
                      {p.barcode ?? "—"}
                    </TableCell>

                    <TableCell>{p.productCategoryLabel ?? "—"}</TableCell>
                    <TableCell>{p.brandName ?? "—"}</TableCell>

                    <TableCell align="right">{p.qteInStock ?? 0}</TableCell>

                    <TableCell align="right">
                      {formatMoney(p.mcSellPrice)}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{created.date}</Typography>
                      {created.time ? (
                        <Typography variant="caption" color="text.secondary">
                          {created.time}
                        </Typography>
                      ) : null}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={p.publishable ? "Published" : "Draft"}
                        color={p.publishable ? "success" : "default"}
                        variant={p.publishable ? "filled" : "outlined"}
                      />
                    </TableCell>

                    <TableCell
                      align="right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => onView(p.id)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => onEdit(p.id)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={(_, next) => setPage(next)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
