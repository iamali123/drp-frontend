import { useState, useEffect } from "react";
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
import { BlockLeaveFormDialog } from "@/components/blockLeaves/BlockLeaveFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import {
  useBlockLeavesList,
  useCreateBlockLeave,
  useUpdateBlockLeave,
  useDeleteBlockLeave,
} from "@/apis/hooks/useBlockLeaves";
import type {
  BlockLeave,
  CreateBlockLeavePayload,
  UpdateBlockLeavePayload,
} from "@/apis/types/blockLeaves";
import { getOrganizationId } from "@/apis/client";
import { Plus, Pencil, Trash2, CalendarOff } from "lucide-react";

function formatDate(dateString: string) {
  return dateString ? new Date(dateString).toLocaleDateString() : "—";
}

export function BlockLeavesPage() {
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<BlockLeave | null>(null);

  const organizationId = getOrganizationId();
  const { data: blocks = [], isLoading, isError, error } = useBlockLeavesList();
  const createMutation = useCreateBlockLeave({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "Block leave created." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateBlockLeave({
    onSuccess: () => {
      setEditingBlock(null);
      setFlash({ type: "success", message: "Block leave updated." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteBlockLeave({
    onSuccess: () => setFlash({ type: "success", message: "Block leave deleted." }),
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  // Show error toast from mutation state (backup if onError doesn't run)
  useEffect(() => {
    const err = createMutation.error ?? updateMutation.error;
    if (err?.message) setFlash({ type: "error", message: err.message });
  }, [createMutation.error, updateMutation.error]);

  const handleCreate = async (payload: CreateBlockLeavePayload) => {
    try {
      await createMutation.mutateAsync(payload);
    } catch (e) {
      setFlash({
        type: "error",
        message: e instanceof Error ? e.message : "Create failed",
      });
    }
  };
  const handleUpdate = (payload: UpdateBlockLeavePayload) => {
    updateMutation.mutate(payload);
  };
  const handleDelete = (block: BlockLeave) => {
    if (window.confirm(`Delete block leave "${block.reason}"?`)) {
      deleteMutation.mutate(block.id);
    }
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Block Leaves</h2>
        <Button
          onClick={() => setCreateOpen(true)}
          size="sm"
          className="gap-2"
          disabled={!organizationId}
        >
          <Plus className="h-4 w-4" />
          Add block leave
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <CalendarOff className="h-5 w-5" />
            <span className="font-medium">Periods when leave requests are blocked</span>
          </div>
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load block leaves."}
            </div>
          )}
          {!isLoading && !isError && blocks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50/50 px-4 py-8 text-center text-slate-600">
              <p className="mb-4">No block leave periods set.</p>
              <Button onClick={() => setCreateOpen(true)} size="sm" disabled={!organizationId}>
                Add block leave
              </Button>
            </div>
          )}
          {!isLoading && !isError && blocks.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reason</TableHead>
                    <TableHead>Start date</TableHead>
                    <TableHead>End date</TableHead>
                    <TableHead className="w-40" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blocks.map((block) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-medium">{block.reason}</TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(block.startDate)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(block.endDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setEditingBlock(block)}
                            disabled={deleteMutation.isPending}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(block)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BlockLeaveFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
        organizationId={organizationId}
      />
      {editingBlock && (
        <BlockLeaveFormDialog
          mode="edit"
          initialValues={editingBlock}
          open={!!editingBlock}
          onOpenChange={(open) => !open && setEditingBlock(null)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
