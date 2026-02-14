/**
 * Organizations API service. Responses use { data } wrapper; we unwrap .data.
 */

import { apiRequest } from "@/apis/client";
import type {
  Organization,
  OrganizationCreateInput,
  OrganizationUpdateInput,
  OrganizationApiResponse,
  OrganizationListPagedResponse,
} from "@/apis/types/organizations";

const BASE = "api/organizations";

function unwrap<T>(res: OrganizationApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as OrganizationApiResponse<T>).data;
  return res as T;
}

export const organizationsService = {
  async list(): Promise<Organization[]> {
    const res = await apiRequest<OrganizationApiResponse<Organization[]>>(
      `${BASE}/list-organizations`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<Organization> {
    const res = await apiRequest<OrganizationApiResponse<Organization>>(
      `${BASE}/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Organization not found");
    return data;
  },

  async listPagination(params: {
    pageIndex: number;
    pageSize: number;
  }): Promise<OrganizationListPagedResponse> {
    const search = new URLSearchParams({
      PageIndex: String(params.pageIndex),
      PageSize: String(params.pageSize),
    });
    return apiRequest<OrganizationListPagedResponse>(
      `${BASE}/list-organization-pagination?${search}`
    );
  },

  async create(payload: OrganizationCreateInput): Promise<Organization> {
    const res = await apiRequest<OrganizationApiResponse<Organization>>(
      `${BASE}/create-organization`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create organization failed");
    return data;
  },

  async update(
    id: string,
    payload: OrganizationUpdateInput
  ): Promise<Organization> {
    const res = await apiRequest<OrganizationApiResponse<Organization>>(
      `${BASE}/update-organizaion/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update organization failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<OrganizationApiResponse<void>>(
      `${BASE}/delete-organization/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  },
};
