import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScoreNoteFormDialog } from "@/components/scoreNotes/ScoreNoteFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import {
  useScoreNotesList,
  useMaintenanceScoreNotesList,
  useOperationScoreNotesList,
  useCreateScoreNote,
  useUpdateScoreNote,
} from "@/apis/hooks/useScoreNotes";
import type { ScoreNote, CreateScoreNotePayload } from "@/apis/types/scoreNotes";
import { MoreHorizontal, Pencil, FileText, Filter, Plus } from "lucide-react";

type FilterType = "all" | "Maintenance" | "Operations";

export function ScoreNotesPage() {
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingNote, setEditingNote] = useState<ScoreNote | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: allNotes = [], isLoading: isLoadingAll, refetch: refetchAll } = useScoreNotesList({
    enabled: filter === "all",
  });
  const { data: maintenanceNotes = [], isLoading: isLoadingMaintenance, refetch: refetchMaintenance } =
    useMaintenanceScoreNotesList({
      enabled: filter === "Maintenance",
    });
  const { data: operationNotes = [], isLoading: isLoadingOperation, refetch: refetchOperation } =
    useOperationScoreNotesList({
      enabled: filter === "Operations",
    });

  const isLoading = isLoadingAll || isLoadingMaintenance || isLoadingOperation;
  const notes =
    filter === "all"
      ? allNotes
      : filter === "Maintenance"
        ? maintenanceNotes
        : operationNotes;

  const createMutation = useCreateScoreNote({
    onSuccess: () => {
      setIsCreating(false);
      setFlash({ type: "success", message: "Score note created successfully." });
      // Refetch all queries to ensure the new item appears
      refetchAll();
      refetchMaintenance();
      refetchOperation();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const updateMutation = useUpdateScoreNote({
    onSuccess: () => {
      setEditingNote(null);
      setFlash({ type: "success", message: "Score note updated successfully." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleCreate = (payload: CreateScoreNotePayload) => {
    createMutation.mutate(payload);
  };

  const handleUpdate = (payload: {
    id: string;
    description: string;
    score: number;
    scoreNotesType: string;
  }) => {
    updateMutation.mutate({ id: payload.id, payload });
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="score-notes-header">
          Score Notes
        </h2>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsCreating(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Score Note
          </Button>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              {filter === "all"
                ? "All"
                : filter === "Maintenance"
                  ? "Maintenance"
                  : "Operations"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Maintenance")}>
              Maintenance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("Operations")}>
              Operations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <FileText className="h-5 w-5" />
            <span className="font-medium">
              {filter === "all"
                ? "All score notes"
                : filter === "Maintenance"
                  ? "Maintenance score notes"
                  : "Operations score notes"}
            </span>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {!isLoading && notes.length === 0 && (
            <p className="py-8 text-center text-slate-500">
              No score notes found{filter !== "all" ? ` for ${filter}` : ""}.
            </p>
          )}
          {!isLoading && notes.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">{note.description}</TableCell>
                      <TableCell>
                        <Badge
                          variant={note.score >= 0 ? "outline" : "secondary"}
                          className={note.score >= 0 ? "text-emerald-600" : "text-red-600"}
                        >
                          {note.score >= 0 ? "+" : ""}
                          {note.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{note.scoreNotesType}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingNote(note)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {isCreating && (
        <ScoreNoteFormDialog
          mode="create"
          open={isCreating}
          onOpenChange={(open) => !open && setIsCreating(false)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
        />
      )}

      {editingNote && (
        <ScoreNoteFormDialog
          mode="edit"
          open={!!editingNote}
          onOpenChange={(open) => !open && setEditingNote(null)}
          initialValues={editingNote}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
