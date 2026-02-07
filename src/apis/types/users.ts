/**
 * Types for Users API (create, list, get, update, delete).
 */

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  organizationId: string;
  departmentId: string;
  role: string;
  email: string;
}

/** Matches GET list-organization-users / GET users/{id} response data shape. */
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string | null;
  role: string;
  isActive: boolean;
  organizationId: string;
  departmentName: string;
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface UserApiResponse<T = User> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}

export interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  departmentId: string;
  isActive: boolean;
}
