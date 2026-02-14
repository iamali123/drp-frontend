/**
 * React Query hooks for Department API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { departmentsService } from "@/apis/services/departments";
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/apis/types/departments";

export const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  list: () => [...departmentKeys.lists()] as const,
  details: () => [...departmentKeys.all, "detail"] as const,
  detail: (id: string) => [...departmentKeys.details(), id] as const,
};

export function useDepartmentsList(
  options?: Omit<UseQueryOptions<Department[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: departmentKeys.list(),
    queryFn: () => departmentsService.listOrganizationDepartments(),
    ...options,
  });
}

export function useDepartment(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<Department, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: departmentKeys.detail(id ?? ""),
    queryFn: () => departmentsService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateDepartment(
  options?: UseMutationOptions<Department, Error, CreateDepartmentPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDepartmentPayload) =>
      departmentsService.create(payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.refetchQueries({ queryKey: departmentKeys.lists() });
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useUpdateDepartment(
  options?: UseMutationOptions<
    Department,
    Error,
    { id: string; payload: UpdateDepartmentPayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateDepartmentPayload }) =>
      departmentsService.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.refetchQueries({ queryKey: departmentKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: departmentKeys.detail(data.id) });
        queryClient.refetchQueries({ queryKey: departmentKeys.detail(data.id) });
      }
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}

export function useDeleteDepartment(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => departmentsService.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.refetchQueries({ queryKey: departmentKeys.lists() });
      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context);
    },
    onError: options?.onError,
    onSettled: options?.onSettled,
  });
}
