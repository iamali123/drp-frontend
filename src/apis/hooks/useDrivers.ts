/**
 * React Query hooks for Driver API.
 */

import {
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { driversService } from "@/apis/services/drivers";
import type { Driver, DriverListPagedResponse } from "@/apis/types/drivers";

export const driverKeys = {
  all: ["drivers"] as const,
  lists: () => [...driverKeys.all, "list"] as const,
  list: () => [...driverKeys.lists()] as const,
  listPaged: (pageIndex: number, pageSize: number) =>
    [...driverKeys.all, "listPaged", pageIndex, pageSize] as const,
};

const DROPDOWN_PAGE_SIZE = 500;

/** Fetches drivers for dropdowns (one large page). */
export function useDriversList(
  options?: Omit<
    UseQueryOptions<DriverListPagedResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: [...driverKeys.list(), DROPDOWN_PAGE_SIZE],
    queryFn: () =>
      driversService.listPagination({
        pageIndex: 1,
        pageSize: DROPDOWN_PAGE_SIZE,
      }),
    ...options,
  });
}

export function useDriversListPagination(
  pageIndex: number,
  pageSize: number,
  options?: Omit<
    UseQueryOptions<DriverListPagedResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: driverKeys.listPaged(pageIndex, pageSize),
    queryFn: () => driversService.listPagination({ pageIndex, pageSize }),
    ...options,
  });
}
