/**
 * Types for Organizations API.
 * GET list / GET {id} response data shape and create/update payloads.
 */

/** Matches GET /api/organizations and GET /api/organizations/{id} response data. */
export interface Organization {
  id: string;
  name: string;
  isDefault: boolean;
  address: string;
  companyContactName: string;
  companyContactPhone: string;
  companyContactEmail: string;
  dotNumber: string;
  mcNumber: string;
  timeZone: string;
  accountStatus: string;
  billingStatus: string;
  maxDriverSeats: number;
  telematicsProvider: string;
  samsaraApiToken: string;
}

/** Request body for create (all fields required). */
export interface OrganizationCreatePayload {
  name: string;
  address: string;
  companyContactName: string;
  companyContactPhone: string;
  companyContactEmail: string;
  dotNumber: string;
  mcNumber: string;
  timeZone: string;
  accountStatus: string;
  billingStatus: string;
  maxDriverSeats: number;
  telematicsProvider: string;
  samsaraApiToken: string;
}

/** Request body for update (only specific fields allowed). */
export interface OrganizationUpdatePayload {
  id: string;
  address: string;
  companyContactName: string;
  companyContactPhone: string;
  companyContactEmail: string;
  dotNumber: string;
  mcNumber: string;
  timeZone: string;
  maxDriverSeats: number;
}

/** Legacy type for backward compatibility. */
export interface OrganizationPayload {
  name: string;
  address?: string;
  companyContactName?: string;
  companyContactPhone?: string;
  companyContactEmail?: string;
  dotNumber?: string;
  mcNumber?: string;
  timeZone?: string;
  accountStatus?: string;
  billingStatus?: string;
  maxDriverSeats?: number;
  telematicsProvider?: string;
  samsaraApiToken?: string;
}

/** API response wrapper: { data, succeeded?, ... } */
export interface OrganizationApiResponse<T = Organization> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}

/** GET list-organization-pagination response. */
export interface OrganizationListPagedResponse {
  data: Organization[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  succeeded?: boolean;
}

export type OrganizationCreateInput = OrganizationCreatePayload;
export type OrganizationUpdateInput = OrganizationUpdatePayload;
