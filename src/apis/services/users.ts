/**
 * Users API service. Responses follow { succeeded, data } wrapper; we unwrap .data.
 */

import { apiRequest } from "@/apis/client";
import type {
  CreateUserPayload,
  User,
  UpdateUserPayload,
  UserApiResponse,
} from "@/apis/types/users";

const BASE = "api/users";

function unwrap<T>(res: UserApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res) return (res as UserApiResponse<T>).data;
  return res as T;
}

export const usersService = {
  async listOrganizationUsers(): Promise<User[]> {
    const res = await apiRequest<UserApiResponse<User[]>>(`${BASE}/list-organization-users`);
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<User> {
    const res = await apiRequest<UserApiResponse<User>>(`${BASE}/${encodeURIComponent(id)}`);
    const data = unwrap(res);
    if (!data) throw new Error("User not found");
    return data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const res = await apiRequest<UserApiResponse<User>>(`${BASE}/create-user`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = unwrap(res);
    if (!data) throw new Error("Create user failed");
    return data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const res = await apiRequest<UserApiResponse<User>>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    const data = unwrap(res);
    if (!data) throw new Error("Update user failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiRequest<UserApiResponse<void>>(`${BASE}/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
