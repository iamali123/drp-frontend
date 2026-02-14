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
import { LeaveLimitFormDialog } from "@/components/leaveLimits/LeaveLimitFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import {
  useLeaveLimitsList,
  useCreateLeaveLimit,
  useUpdateLeaveLimit,
  useDeleteLeaveLimit,
} from "@/apis/hooks/useLeaveLimits";
import type { LeaveLimit, CreateLeaveLimitPayload, UpdateLeaveLimitPayload } from "@/apis/types/leaveLimits";
import { MoreHorizontal, Plus, Pencil, Trash2, Sliders } from "lucide-react";

export function LeaveLimitsPage() {
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingLimit, setEditingLimit] = useState<LeaveLimit | null>(null);

  const { data: limits = [], isLoading, isError, error } = useLeaveLimitsList();
  const createMutation = useCreateLeaveLimit({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "Leave limit created." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateLeaveLimit({
    onSuccess: () => {
      setEditingLimit(null);
      setFlash({ type: "success", message: "Leave limit updated." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteLeaveLimit({
    onSuccess: () => setFlash({ type: "success", message: "Leave limit deleted." }),
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleCreate = (payload: CreateLeaveLimitPayload) => {
    createMutation.mutate(payload);
  };
  const handleUpdate = (payload: UpdateLeaveLimitPayload) => {
    updateMutation.mutate({ id: payload.id, payload });
  };
  const handleDelete = (limit: LeaveLimit) => {
    if (window.confirm(`Delete leave limit for ${limit.driverType} / ${limit.domicile}?`)) {
      deleteMutation.mutate(limit.id);
    }
  };

  const formatDate = (dateString: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : "—";

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Leave Limits</h2>
        <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add leave limit
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <Sliders className="h-5 w-5" />
            <span className="font-medium">Max drivers off by driver type and domicile</span>
          </div>
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load leave limits."}
            </div>
          )}
          {!isLoading && !isError && limits.length === 0 && (
            <p className="py-8 text-center text-slate-500">
              No leave limits. Add one to set max drivers off per driver type and domicile.
            </p>
          )}
          {!isLoading && !isError && limits.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver type</TableHead>
                    <TableHead>Domicile</TableHead>
                    <TableHead className="text-right">Max drivers off</TableHead>
                    <TableHead>Start date</TableHead>
                    <TableHead>End date</TableHead>
                    <TableHead className="w-12" aria-label="Actions" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {limits.map((limit) => (
                    <TableRow key={limit.id}>
                      <TableCell className="font-medium">{limit.driverType}</TableCell>
                      <TableCell>{limit.domicile}</TableCell>
                      <TableCell className="text-right">{limit.maxDriverOff}</TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(limit.startDate)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(limit.endDate)}
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
                            <DropdownMenuItem
                              onClick={() => setEditingLimit(limit)}
                              disabled={deleteMutation.isPending}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(limit)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

      <LeaveLimitFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
      {editingLimit && (
        <LeaveLimitFormDialog
          mode="edit"
          initialValues={editingLimit}
          open={!!editingLimit}
          onOpenChange={(open) => !open && setEditingLimit(null)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
