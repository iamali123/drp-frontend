/**
 * React Query hooks for Score Settings API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { scoreSettingsService } from "@/apis/services/scoreSettings";
import type {
  ScoreSettings,
  UpdateScoreSettingsPayload,
} from "@/apis/types/scoreSettings";

export const scoreSettingsKeys = {
  all: ["scoreSettings"] as const,
  lists: () => [...scoreSettingsKeys.all, "list"] as const,
  list: () => [...scoreSettingsKeys.lists()] as const,
  details: () => [...scoreSettingsKeys.all, "detail"] as const,
  detail: (id: string) => [...scoreSettingsKeys.details(), id] as const,
};

export function useScoreSettingsList(
  options?: Omit<UseQueryOptions<ScoreSettings[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: scoreSettingsKeys.list(),
    queryFn: () => scoreSettingsService.listOrganizationScoreSettings(),
    ...options,
  });
}

export function useUpdateScoreSettings(
  options?: UseMutationOptions<
    ScoreSettings,
    Error,
    { id: string; payload: UpdateScoreSettingsPayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateScoreSettingsPayload }) =>
      scoreSettingsService.update(id, payload),
    onSuccess: async (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: scoreSettingsKeys.all });
      await queryClient.refetchQueries({ queryKey: scoreSettingsKeys.list() });
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
