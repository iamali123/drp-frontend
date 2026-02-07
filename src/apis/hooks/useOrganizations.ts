/**
 * React Query hooks for Organizations API.
 * Handles fetching, caching, mutations, and error handling.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { organizationsService } from "@/apis/services/organizations";
import type {
  Organization,
  OrganizationCreateInput,
  OrganizationUpdateInput,
} from "@/apis/types/organizations";

export const organizationKeys = {
  all: ["organizations"] as const,
  lists: () => [...organizationKeys.all, "list"] as const,
  list: () => [...organizationKeys.lists()] as const,
  details: () => [...organizationKeys.all, "detail"] as const,
  detail: (id: string) => [...organizationKeys.details(), id] as const,
};

export function useOrganizationsList(
  options?: Omit<
    UseQueryOptions<Organization[], Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: organizationKeys.list(),
    queryFn: () => organizationsService.list(),
    ...options,
  });
}

export function useOrganization(
  id: string | undefined | null,
  options?: Omit<
    UseQueryOptions<Organization, Error>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: organizationKeys.detail(id ?? ""),
    queryFn: () => organizationsService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateOrganization(
  options?: UseMutationOptions<
    Organization,
    Error,
    OrganizationCreateInput
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OrganizationCreateInput) =>
      organizationsService.create(payload),
    onSuccess: (_, __, ctx) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
    ...options,
  });
}

export function useUpdateOrganization(
  options?: UseMutationOptions<
    Organization,
    Error,
    { id: string; payload: OrganizationUpdateInput }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: OrganizationUpdateInput }) =>
      organizationsService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: organizationKeys.detail(data.id),
        });
      }
    },
    ...options,
  });
}

export function useDeleteOrganization(
  options?: UseMutationOptions<void, Error, string>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
    ...options,
  });
}
