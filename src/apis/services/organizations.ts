/**
 * Organizations API service: raw HTTP calls.
 * Base URL and X-Organization-Id are applied by the shared API client.
 */

import { apiRequest } from "@/apis/client";
import type {
  Organization,
  OrganizationCreateInput,
  OrganizationUpdateInput,
} from "@/apis/types/organizations";

const BASE = "api/organizations";

export const organizationsService = {
  async list(): Promise<Organization[]> {
    const data = await apiRequest<Organization[] | { data: Organization[] }>(
      BASE
    );
    return Array.isArray(data) ? data : (data as { data: Organization[] }).data ?? [];
  },

  async getById(id: string): Promise<Organization> {
    return apiRequest<Organization>(`${BASE}/${encodeURIComponent(id)}`);
  },

  async create(payload: OrganizationCreateInput): Promise<Organization> {
    return apiRequest<Organization>(BASE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async update(
    id: string,
    payload: OrganizationUpdateInput
  ): Promise<Organization> {
    return apiRequest<Organization>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
