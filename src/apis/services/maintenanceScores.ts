/**
 * Maintenance Scores API service.
 */

import { apiRequest } from "@/apis/client";
import type {
  MaintenanceScore,
  MaintenanceScoreListPagedResponse,
  UpdateMaintenanceScorePayload,
  MaintenanceScoreApiResponse,
} from "@/apis/types/maintenanceScores";

const BASE = "api/MaintenanceScores";

function unwrap<T>(res: MaintenanceScoreApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as MaintenanceScoreApiResponse<T>).data;
  return res as T;
}

export const maintenanceScoresService = {
  async listOrganizationMaintenanceScores(params: {
    pageIndex: number;
    pageSize: number;
    driverId?: string;
  }): Promise<MaintenanceScoreListPagedResponse> {
    const search = new URLSearchParams({
      PageIndex: String(params.pageIndex),
      PageSize: String(params.pageSize),
    });
    if (params.driverId) {
      search.set("DriverId", params.driverId);
    }
    return apiRequest<MaintenanceScoreListPagedResponse>(
      `${BASE}/list-organization-maintenance-scores?${search}`
    );
  },

  async getById(id: string): Promise<MaintenanceScore> {
    const res = await apiRequest<MaintenanceScoreApiResponse<MaintenanceScore>>(
      `${BASE}/get-maintenance-score/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Maintenance score not found");
    return data;
  },

  async update(id: string, payload: UpdateMaintenanceScorePayload): Promise<MaintenanceScore> {
    const res = await apiRequest<MaintenanceScoreApiResponse<MaintenanceScore>>(
      `${BASE}/update-maintenance-score/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update maintenance score failed");
    return data;
  },
};
