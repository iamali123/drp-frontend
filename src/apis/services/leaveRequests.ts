/**
 * Leave Request API service.
 */

import { apiRequest } from "@/apis/client";
import type {
  LeaveRequest,
  CreateLeaveRequestPayload,
  UpdateLeaveRequestPayload,
  LeaveRequestApiResponse,
} from "@/apis/types/leaveRequests";

const BASE = "api/LeaveRequest";

function unwrap<T>(res: LeaveRequestApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as LeaveRequestApiResponse<T>).data;
  return res as T;
}

export const leaveRequestsService = {
  async getAll(): Promise<LeaveRequest[]> {
    const res = await apiRequest<LeaveRequestApiResponse<LeaveRequest[]>>(
      `${BASE}/get-all-leave-requests`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<LeaveRequest> {
    const res = await apiRequest<LeaveRequestApiResponse<LeaveRequest>>(
      `${BASE}/get-leave-request/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Leave request not found");
    return data;
  },

  async create(payload: CreateLeaveRequestPayload): Promise<LeaveRequest> {
    const res = await apiRequest<LeaveRequestApiResponse<LeaveRequest>>(
      `${BASE}/create-leave-request`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create leave request failed");
    return data;
  },

  async update(id: string, payload: UpdateLeaveRequestPayload): Promise<LeaveRequest> {
    const res = await apiRequest<LeaveRequestApiResponse<LeaveRequest>>(
      `${BASE}/update-leave-request/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update leave request failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<LeaveRequestApiResponse<void>>(
      `${BASE}/delete-leave-request/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  },
};
