/**
 * Types for Score Notes API (list, get, update).
 */

/** Matches GET list-organization-score-notes response data item. */
export interface ScoreNote {
  id: string;
  description: string;
  score: number;
  scoreNotesType: string;
  organizationId: string;
  createdAt: string;
}

export interface CreateScoreNotePayload {
  description: string;
  score: number;
  scoreNotesType: string;
}

export interface UpdateScoreNotePayload {
  id: string;
  description: string;
  score: number;
  scoreNotesType: string;
}

/** API response wrapper: { succeeded, data, message, ... } */
export interface ScoreNoteApiResponse<T = ScoreNote> {
  succeeded?: boolean;
  data?: T;
  message?: string;
}
