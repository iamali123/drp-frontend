/**
 * Score Notes API service. Responses use { data } wrapper; we unwrap .data.
 */

import { apiRequest } from "@/apis/client";
import type {
  ScoreNote,
  CreateScoreNotePayload,
  UpdateScoreNotePayload,
  ScoreNoteApiResponse,
} from "@/apis/types/scoreNotes";

const BASE = "api/ScoreNotes";

function unwrap<T>(res: ScoreNoteApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as ScoreNoteApiResponse<T>).data;
  return res as T;
}

export const scoreNotesService = {
  async listOrganizationScoreNotes(): Promise<ScoreNote[]> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote[]>>(
      `${BASE}/list-organization-score-notes`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async listOrganizationMaintenanceScoreNotes(): Promise<ScoreNote[]> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote[]>>(
      `${BASE}/list-organization-maintenance-score-notes`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async listOrganizationOperationScoreNotes(): Promise<ScoreNote[]> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote[]>>(
      `${BASE}/list-organization-operation-score-notes`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async getById(id: string): Promise<ScoreNote> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote>>(
      `${BASE}/get-score-notes/${encodeURIComponent(id)}`
    );
    const data = unwrap(res);
    if (!data) throw new Error("Score note not found");
    return data;
  },

  async create(payload: CreateScoreNotePayload): Promise<ScoreNote> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote>>(
      `${BASE}/create-score-notes`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create score note failed");
    return data;
  },

  async update(id: string, payload: UpdateScoreNotePayload): Promise<ScoreNote> {
    const res = await apiRequest<ScoreNoteApiResponse<ScoreNote>>(
      `${BASE}/update-score-notes/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update score note failed");
    return data;
  },
};
