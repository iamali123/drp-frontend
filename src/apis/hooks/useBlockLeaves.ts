/**
 * React Query hooks for Block Leaves API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { blockLeavesService } from "@/apis/services/blockLeaves";
import type {
  BlockLeave,
  CreateBlockLeavePayload,
  UpdateBlockLeavePayload,
} from "@/apis/types/blockLeaves";

export const blockLeaveKeys = {
  all: ["blockLeaves"] as const,
  lists: () => [...blockLeaveKeys.all, "list"] as const,
  list: () => [...blockLeaveKeys.lists()] as const,
};

export function useBlockLeavesList(
  options?: Omit<UseQueryOptions<BlockLeave[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: blockLeaveKeys.list(),
    queryFn: () => blockLeavesService.getList(),
    ...options,
  });
}

export function useCreateBlockLeave(
  options?: UseMutationOptions<BlockLeave, Error, CreateBlockLeavePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBlockLeavePayload) =>
      blockLeavesService.create(payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blockLeaveKeys.all });
      await queryClient.refetchQueries({ queryKey: blockLeaveKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useUpdateBlockLeave(
  options?: UseMutationOptions<BlockLeave, Error, UpdateBlockLeavePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateBlockLeavePayload) =>
      blockLeavesService.update(payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blockLeaveKeys.all });
      await queryClient.refetchQueries({ queryKey: blockLeaveKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useDeleteBlockLeave(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => blockLeavesService.delete(id),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: blockLeaveKeys.all });
      await queryClient.refetchQueries({ queryKey: blockLeaveKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
