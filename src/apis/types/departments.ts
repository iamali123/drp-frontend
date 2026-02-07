/**
 * Types for Department API (create, list, get, update, delete).
 */

/** Matches GET list-organization-departments response data item. */
export interface Department {
  id: string;
  departmentName: string;
  organizationId: string;
  createdAt: string;
}

export interface CreateDepartmentPayload {
  departmentName: string;
  organizationId: string;
}

export interface UpdateDepartmentPayload {
  id: string;
  departmentName: string;
}

/** API response wrapper: { data, succeeded?, ... } */
export interface DepartmentApiResponse<T = Department> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
