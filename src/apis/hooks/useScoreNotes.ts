/**
 * React Query hooks for Score Notes API.
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { scoreNotesService } from "@/apis/services/scoreNotes";
import type {
  ScoreNote,
  CreateScoreNotePayload,
  UpdateScoreNotePayload,
} from "@/apis/types/scoreNotes";

export const scoreNoteKeys = {
  all: ["scoreNotes"] as const,
  lists: () => [...scoreNoteKeys.all, "list"] as const,
  list: () => [...scoreNoteKeys.lists()] as const,
  listMaintenance: () => [...scoreNoteKeys.all, "listMaintenance"] as const,
  listOperation: () => [...scoreNoteKeys.all, "listOperation"] as const,
  details: () => [...scoreNoteKeys.all, "detail"] as const,
  detail: (id: string) => [...scoreNoteKeys.details(), id] as const,
};

export function useScoreNotesList(
  options?: Omit<UseQueryOptions<ScoreNote[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: scoreNoteKeys.list(),
    queryFn: () => scoreNotesService.listOrganizationScoreNotes(),
    ...options,
  });
}

export function useMaintenanceScoreNotesList(
  options?: Omit<UseQueryOptions<ScoreNote[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: scoreNoteKeys.listMaintenance(),
    queryFn: () => scoreNotesService.listOrganizationMaintenanceScoreNotes(),
    ...options,
  });
}

export function useOperationScoreNotesList(
  options?: Omit<UseQueryOptions<ScoreNote[], Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: scoreNoteKeys.listOperation(),
    queryFn: () => scoreNotesService.listOrganizationOperationScoreNotes(),
    ...options,
  });
}

export function useScoreNote(
  id: string | undefined | null,
  options?: Omit<UseQueryOptions<ScoreNote, Error>, "queryKey" | "queryFn">
) {
  return useQuery({
    queryKey: scoreNoteKeys.detail(id ?? ""),
    queryFn: () => scoreNotesService.getById(id!),
    enabled: !!id,
    ...options,
  });
}

export function useCreateScoreNote(
  options?: UseMutationOptions<ScoreNote, Error, CreateScoreNotePayload>
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateScoreNotePayload) => scoreNotesService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.listMaintenance() });
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.listOperation() });
      // Force refetch all list queries
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.lists() });
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.listMaintenance() });
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.listOperation() });
    },
    ...options,
  });
}

export function useUpdateScoreNote(
  options?: UseMutationOptions<
    ScoreNote,
    Error,
    { id: string; payload: UpdateScoreNotePayload }
  >
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateScoreNotePayload }) =>
      scoreNotesService.update(id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.lists() });
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.listMaintenance() });
      queryClient.invalidateQueries({ queryKey: scoreNoteKeys.listOperation() });
      // Force refetch all list queries
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.lists() });
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.listMaintenance() });
      queryClient.refetchQueries({ queryKey: scoreNoteKeys.listOperation() });
      if (data?.id) {
        queryClient.invalidateQueries({ queryKey: scoreNoteKeys.detail(data.id) });
        queryClient.refetchQueries({ queryKey: scoreNoteKeys.detail(data.id) });
      }
    },
    ...options,
  });
}
