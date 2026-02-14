/**
 * React Query hooks for Leave Limit API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { leaveLimitsService } from "@/apis/services/leaveLimits";
import type {
  LeaveLimit,
  CreateLeaveLimitPayload,
  UpdateLeaveLimitPayload,
} from "@/apis/types/leaveLimits";

export const leaveLimitKeys = {
  all: ["leaveLimits"] as const,
  lists: () => [...leaveLimitKeys.all, "list"] as const,
  list: () => [...leaveLimitKeys.lists()] as const,
  details: () => [...leaveLimitKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveLimitKeys.details(), id] as const,
};

export function useLeaveLimitsList(
  options?: Omit<UseQueryOptions<LeaveLimit[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: leaveLimitKeys.list(),
    queryFn: () => leaveLimitsService.listOrganizationLeaveLimits(),
    ...options,
  });
}

export function useLeaveLimit(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<LeaveLimit, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: leaveLimitKeys.detail(id ?? ""),
    queryFn: () => leaveLimitsService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateLeaveLimit(
  options?: UseMutationOptions<LeaveLimit, Error, CreateLeaveLimitPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeaveLimitPayload) =>
      leaveLimitsService.create(payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveLimitKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveLimitKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useUpdateLeaveLimit(
  options?: UseMutationOptions<
    LeaveLimit,
    Error,
    { id: string; payload: UpdateLeaveLimitPayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeaveLimitPayload }) =>
      leaveLimitsService.update(id, payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveLimitKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveLimitKeys.list() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: leaveLimitKeys.detail(data.id) });
        await queryClient.refetchQueries({ queryKey: leaveLimitKeys.detail(data.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useDeleteLeaveLimit(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveLimitsService.delete(id),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveLimitKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveLimitKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
