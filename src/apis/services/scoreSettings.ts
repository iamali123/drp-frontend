/**
 * Score Settings API service. Responses use { data } wrapper; we unwrap .data.
 */

import { apiRequest } from "@/apis/client";
import type {
  ScoreSettings,
  UpdateScoreSettingsPayload,
  ScoreSettingsApiResponse,
} from "@/apis/types/scoreSettings";

const BASE = "api/ScoreSettings";

function unwrap<T>(res: ScoreSettingsApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as ScoreSettingsApiResponse<T>).data;
  return res as T;
}

export const scoreSettingsService = {
  async listOrganizationScoreSettings(): Promise<ScoreSettings[]> {
    const res = await apiRequest<ScoreSettingsApiResponse<ScoreSettings[]>>(
      `${BASE}/list-organization-score-settings`
    );
    const data = unwrap(res);
    return Array.isArray(data) ? data : [];
  },

  async update(id: string, payload: UpdateScoreSettingsPayload): Promise<ScoreSettings> {
    const res = await apiRequest<ScoreSettingsApiResponse<ScoreSettings>>(
      `${BASE}/update-score-settings/${encodeURIComponent(id)}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update score settings failed");
    return data;
  },
};
