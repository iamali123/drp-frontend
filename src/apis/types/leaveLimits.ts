/**
 * Types for Leave Limit API.
 */

/** Matches GET list-organization-leave-limits and GET get-leave-limit/{id} response data item. */
export interface LeaveLimit {
  id: string;
  driverType: string;
  domicile: string;
  maxDriverOff: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/** POST create-leave-limit payload. */
export interface CreateLeaveLimitPayload {
  driverType: string;
  domicile: string;
  maxDriverOff: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

/** PUT update-leave-limit/{id} payload. */
export interface UpdateLeaveLimitPayload {
  id: string;
  driverType: string;
  domicile: string;
  maxDriverOff: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface LeaveLimitApiResponse<T = LeaveLimit> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
