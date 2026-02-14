/**
 * Driver API service. Responses use paginated wrapper.
 */

import { apiRequest } from "@/apis/client";
import type { DriverListPagedResponse } from "@/apis/types/drivers";

const BASE = "api/Driver";

export const driversService = {
  async listPagination(params: {
    pageIndex: number;
    pageSize: number;
  }): Promise<DriverListPagedResponse> {
    const search = new URLSearchParams({
      PageIndex: String(params.pageIndex),
      PageSize: String(params.pageSize),
    });
    return apiRequest<DriverListPagedResponse>(
      `${BASE}/list-driver-pagination?${search}`
    );
  },
};
