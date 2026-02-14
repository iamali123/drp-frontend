/**
 * Types for Score Settings API (list, update).
 */

export interface ScoreRange {
  minimum: number;
  maximum: number;
  base: number;
}

/** Matches GET list-organization-score-settings response data item. */
export interface ScoreSettings {
  id: string;
  organizationId: string;
  operations: ScoreRange;
  maintenance: ScoreRange;
  createdAt: string;
}

export interface UpdateScoreSettingsPayload {
  id: string;
  operations: ScoreRange;
  maintenance: ScoreRange;
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface ScoreSettingsApiResponse<T = ScoreSettings> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
