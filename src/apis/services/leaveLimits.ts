/**
 * Leave Limit API service.
 */

import { apiRequest } from "@/apis/client";
import type {
  LeaveLimit,
  CreateLeaveLimitPayload,
  UpdateLeaveLimitPayload,
  LeaveLimitApiResponse,
} from "@/apis/types/leaveLimits";

const BASE = "api/LeaveLimit";

function unwrap<T>(res: LeaveLimitApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as LeaveLimitApiResponse<T>).data;
  return res as T;
}

export const leaveLimitsService = {
  async listOrganizationLeaveLimits(): Promise<LeaveLimit[]> {
    const res = await apiRequest<LeaveLimitApiResponse<LeaveLimit[]>>(
      `${BASE}/list-organization-leave-limits`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<LeaveLimit> {
    const res = await apiRequest<LeaveLimitApiResponse<LeaveLimit>>(
      `${BASE}/get-leave-limit/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Leave limit not found");
    return data;
  },

  async create(payload: CreateLeaveLimitPayload): Promise<LeaveLimit> {
    const res = await apiRequest<LeaveLimitApiResponse<LeaveLimit>>(
      `${BASE}/create-leave-limit`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create leave limit failed");
    return data;
  },

  async update(id: string, payload: UpdateLeaveLimitPayload): Promise<LeaveLimit> {
    const res = await apiRequest<LeaveLimitApiResponse<LeaveLimit>>(
      `${BASE}/update-leave-limit/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update leave limit failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<LeaveLimitApiResponse<void>>(
      `${BASE}/delete-leave-limit/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  },
};
