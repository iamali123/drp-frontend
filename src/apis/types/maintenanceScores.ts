/**
 * Types for Maintenance Scores API (list, get, update).
 */

/** Matches GET list-organization-maintenance-scores response data item. */
export interface MaintenanceScore {
  id: string;
  organizationId: string;
  driverId: string;
  month: string; // ISO date string
  score: number;
  updatedBy: string;
  createdAt: string;
  maintenanceNotes: MaintenanceNote[];
  [key: string]: unknown;
}

/** Maintenance note within a maintenance score. */
export interface MaintenanceNote {
  maintenanceNoteId: string;
  noteDescription: string;
  noteScore: number;
  day: string; // ISO date string
  createdAt: string;
}

/** GET list-organization-maintenance-scores response. */
export interface MaintenanceScoreListPagedResponse {
  data: MaintenanceScore[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  meta: unknown;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  messages: unknown[];
  succeeded: boolean;
}

/** PUT update-maintenance-score payload. */
export interface UpdateMaintenanceScorePayload {
  id: string;
  driverId: string;
  month: string; // ISO date string
  score: number;
  updatedBy: string;
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface MaintenanceScoreApiResponse<T = MaintenanceScore> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
