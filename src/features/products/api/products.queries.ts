/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productsApi";

export function useProductsQuery() {
  return useQuery({
    queryKey: ["products"], // include filters/pagination here later if you add them
    queryFn: getProducts,
    staleTime: 30_000, // avoid refetch spam while you navigate around
    gcTime: 5 * 60_000,
    retry: (count, err: any) =>
      err?.response?.status === 401 ? false : count < 2,
    refetchOnWindowFocus: false, // dashboard UX feels calmer
  });
}
