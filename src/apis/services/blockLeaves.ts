/**
 * Block Leaves API service.
 */

import { apiRequest } from "@/apis/client";
import type {
  BlockLeave,
  CreateBlockLeavePayload,
  UpdateBlockLeavePayload,
  BlockLeaveApiResponse,
} from "@/apis/types/blockLeaves";

const BASE = "api/Blockleaves";

function unwrap<T>(res: BlockLeaveApiResponse<T> | T): T | undefined {
  if (res && typeof res === "object" && "data" in res)
    return (res as BlockLeaveApiResponse<T>).data;
  return res as T;
}

export const blockLeavesService = {
  async getList(): Promise<BlockLeave[]> {
    const res = await apiRequest<BlockLeaveApiResponse<BlockLeave[] | BlockLeave>>(
      `${BASE}/get-block-leaves`
    );
    const data = unwrap(res);
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object" && "id" in data) return [data as BlockLeave];
    return [];
  },

  async create(payload: CreateBlockLeavePayload): Promise<BlockLeave> {
    const res = await apiRequest<BlockLeaveApiResponse<BlockLeave>>(
      `${BASE}/create-block-leaves`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Create block leave failed");
    return data;
  },

  async update(payload: UpdateBlockLeavePayload): Promise<BlockLeave> {
    const res = await apiRequest<BlockLeaveApiResponse<BlockLeave>>(
      `${BASE}/update-block-leaves`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
    const data = unwrap(res);
    if (!data) throw new Error("Update block leave failed");
    return data;
  },

  async delete(id: string): Promise<void> {
    const params = new URLSearchParams({ Id: id });
    await apiRequest<BlockLeaveApiResponse<void>>(
      `${BASE}/delete-block-leaves?${params}`,
      { method: "DELETE" }
    );
  },
};
