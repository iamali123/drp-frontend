/**
 * Types for Block Leaves API.
 */

/** Matches GET get-block-leaves response data item. */
export interface BlockLeave {
  id: string;
  organizationId: string;
  reason: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/** POST create-block-leaves payload. */
export interface CreateBlockLeavePayload {
  organizationId: string;
  reason: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

/** PUT update-block-leaves payload. */
export interface UpdateBlockLeavePayload {
  id: string;
  organizationId: string;
  reason: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface BlockLeaveApiResponse<T = BlockLeave> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
