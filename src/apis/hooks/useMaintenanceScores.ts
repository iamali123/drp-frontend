/**
 * React Query hooks for Maintenance Scores API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { maintenanceScoresService } from "@/apis/services/maintenanceScores";
import type {
  MaintenanceScore,
  MaintenanceScoreListPagedResponse,
  UpdateMaintenanceScorePayload,
} from "@/apis/types/maintenanceScores";

export const maintenanceScoreKeys = {
  all: ["maintenanceScores"] as const,
  lists: () => [...maintenanceScoreKeys.all, "list"] as const,
  listPaged: (pageIndex: number, pageSize: number, driverId?: string) =>
    [...maintenanceScoreKeys.lists(), "paged", pageIndex, pageSize, driverId] as const,
  details: () => [...maintenanceScoreKeys.all, "detail"] as const,
  detail: (id: string) => [...maintenanceScoreKeys.details(), id] as const,
};

export function useMaintenanceScoresListPagination(
  pageIndex: number,
  pageSize: number,
  driverId?: string,
  options?: Omit<
    UseQueryOptions<MaintenanceScoreListPagedResponse, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: maintenanceScoreKeys.listPaged(pageIndex, pageSize, driverId),
    queryFn: () =>
      maintenanceScoresService.listOrganizationMaintenanceScores({
        pageIndex,
        pageSize,
        driverId,
      }),
    ...options,
  });
}

export function useMaintenanceScore(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<MaintenanceScore, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: maintenanceScoreKeys.detail(id ?? ""),
    queryFn: () => maintenanceScoresService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateMaintenanceScore(
  options?: UseMutationOptions<
    MaintenanceScore,
    Error,
    { id: string; payload: UpdateMaintenanceScorePayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMaintenanceScorePayload }) =>
      maintenanceScoresService.update(id, payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: maintenanceScoreKeys.all });
      await queryClient.refetchQueries({ queryKey: maintenanceScoreKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: maintenanceScoreKeys.detail(data.id) });
        await queryClient.refetchQueries({ queryKey: maintenanceScoreKeys.detail(data.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
