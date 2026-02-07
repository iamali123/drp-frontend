/**
 * React Query hooks for Users API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { usersService } from "@/apis/services/users";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/apis/types/users";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: () => [...userKeys.lists()] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export function useUsersList(
  options?: Omit<UseQueryOptions<User[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: () => usersService.listOrganizationUsers(),
    ...options,
  });
}

export function useUser(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: userKeys.detail(id ?? ""),
    queryFn: () => usersService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateUser(
  options?: UseMutationOptions<User, Error, CreateUserPayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}

export function useUpdateUser(
  options?: UseMutationOptions<User, Error, { id: string; payload: UpdateUserPayload }>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) });
      }
    },
    ...options,
  });
}

export function useDeleteUser(options?: UseMutationOptions<void, Error, string>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    ...options,
  });
}
