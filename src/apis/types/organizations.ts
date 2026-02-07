/**
 * Types for Organizations API.
 * Aligns with request body: name, address, companyContact*, dotNumber, mcNumber, timeZone, accountStatus, billingStatus, maxDriverSeats, telematicsProvider, samsaraApiToken.
 */

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

export interface Organization extends OrganizationPayload {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrganizationCreateInput = OrganizationPayload;
export type OrganizationUpdateInput = Partial<OrganizationPayload>;
