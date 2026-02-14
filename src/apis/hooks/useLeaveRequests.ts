/**
 * React Query hooks for Leave Request API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { leaveRequestsService } from "@/apis/services/leaveRequests";
import type {
  LeaveRequest,
  CreateLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from "@/apis/types/leaveRequests";

export const leaveRequestKeys = {
  all: ["leaveRequests"] as const,
  lists: () => [...leaveRequestKeys.all, "list"] as const,
  list: () => [...leaveRequestKeys.lists()] as const,
  details: () => [...leaveRequestKeys.all, "detail"] as const,
  detail: (id: string) => [...leaveRequestKeys.details(), id] as const,
};

export function useLeaveRequestsList(
  options?: Omit<UseQueryOptions<LeaveRequest[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: leaveRequestKeys.list(),
    queryFn: () => leaveRequestsService.getAll(),
    ...options,
  });
}

export function useLeaveRequest(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<LeaveRequest, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: leaveRequestKeys.detail(id ?? ""),
    queryFn: () => leaveRequestsService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateLeaveRequest(
  options?: UseMutationOptions<LeaveRequest, Error, CreateLeaveRequestPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateLeaveRequestPayload) =>
      leaveRequestsService.create(payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveRequestKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useUpdateLeaveRequest(
  options?: UseMutationOptions<
    LeaveRequest,
    Error,
    { id: string; payload: UpdateLeaveRequestPayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateLeaveRequestPayload }) =>
      leaveRequestsService.update(id, payload),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveRequestKeys.list() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: leaveRequestKeys.detail(data.id) });
        await queryClient.refetchQueries({ queryKey: leaveRequestKeys.detail(data.id) });
      }
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useDeleteLeaveRequest(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveRequestsService.delete(id),
    onSuccess: async (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: leaveRequestKeys.all });
      await queryClient.refetchQueries({ queryKey: leaveRequestKeys.list() });
      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
