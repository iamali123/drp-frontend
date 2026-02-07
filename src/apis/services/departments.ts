/**
 * Department API service. Responses use { data } wrapper; we unwrap .data.
 */

import { apiRequest } from "@/apis/client";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
  DepartmentApiResponse,
} from "@/apis/types/departments";

const BASE = "api/Department";

function unwrap<T>(res: DepartmentApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as DepartmentApiResponse<T>).data;
  return res as T;
}

export const departmentsService = {
  async listOrganizationDepartments(): Promise<Department[]> {
    const res = await apiRequest<DepartmentApiResponse<Department[]>>(
      `${BASE}/list-organization-departments`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<Department> {
    const res = await apiRequest<DepartmentApiResponse<Department>>(
      `${BASE}/get-department/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Department not found");
    return data;
  },

  async create(payload: CreateDepartmentPayload): Promise<Department> {
    const res = await apiRequest<DepartmentApiResponse<Department>>(
      `${BASE}/create-department`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create department failed");
    return data;
  },

  async update(id: string, payload: UpdateDepartmentPayload): Promise<Department> {
    const res = await apiRequest<DepartmentApiResponse<Department>>(
      `${BASE}/update-department/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update department failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<DepartmentApiResponse<void>>(
      `${BASE}/delete-department/${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
  },
};
