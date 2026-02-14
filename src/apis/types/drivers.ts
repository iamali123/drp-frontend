/**
 * Types for Driver API (list with pagination).
 */

/** Matches GET list-driver-pagination response data item. */
export interface Driver {
  id?: string;
  phone: string;
  username: string;
  licenseNumber: string;
  licenseState: string;
  status: string;
  driverType: string;
  timezone: string;
  hireDate: string;
  organizationId: string;
  samsaraDriverId: string;
  [key: string]: unknown;
}

/** GET list-driver-pagination response. */
export interface DriverListPagedResponse {
  data: Driver[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  succeeded?: boolean;
}
