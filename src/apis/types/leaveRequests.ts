/**
 * Types for Leave Request API.
 */

/** Matches GET get-all-leave-requests and GET get-leave-request/{id} response data item. */
export interface LeaveRequest {
  id: string;
  organizationId?: string;
  driverId: string;
  leaveRequestStartDate: string; // ISO date string
  leaveRequestEndDate: string; // ISO date string
  leaveType: string;
  leaveStatus?: string;
  reason: string;
  approvedLeaveRequestStartDate?: string | null; // ISO date string; backend may send "0001-01-01T00:00:00" when unset
  approvedLeaveRequestEndDate?: string | null;
  rejectionNotes?: string | null;
  applyDates?: string; // ISO date string from API
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

/** POST create-leave-request payload. */
export interface CreateLeaveRequestPayload {
  driverId: string;
  leaveRequestStartDate: string; // ISO date string
  leaveRequestEndDate: string; // ISO date string
  leaveType: string;
  reason: string;
}

/** PUT update-leave-request/{id} payload. */
export interface UpdateLeaveRequestPayload {
  id: string;
  leaveStatus: string;
  approvedLeaveRequestStartDate?: string; // ISO date string
  approvedLeaveRequestEndDate?: string; // ISO date string
  rejectionNotes?: string;
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface LeaveRequestApiResponse<T = LeaveRequest> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
