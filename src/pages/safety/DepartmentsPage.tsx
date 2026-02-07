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
import { DepartmentFormDialog } from "@/components/departments/DepartmentFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import { useAuth } from "@/lib/auth";
import {
  useDepartmentsList,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from "@/apis/hooks/useDepartments";
import type { Department } from "@/apis/types/departments";
import { MoreHorizontal, Plus, Pencil, Trash2, Layers } from "lucide-react";

export function DepartmentsPage() {
  const { user: authUser } = useAuth();
  const defaultOrganizationId = authUser?.organizationId ?? "";
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);

  const { data: departments = [], isLoading, isError, error } = useDepartmentsList();
  const createMutation = useCreateDepartment({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "Department created successfully." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateDepartment({
    onSuccess: () => {
      setEditingDept(null);
      setFlash({ type: "success", message: "Department updated successfully." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteDepartment({
    onSuccess: () => setFlash({ type: "success", message: "Department deleted." }),
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleCreate = (payload: { departmentName: string; organizationId: string }) => {
    createMutation.mutate(payload);
  };
  const handleUpdate = (payload: { id: string; departmentName: string }) => {
    updateMutation.mutate({ id: payload.id, payload });
  };
  const handleDelete = (d: Department) => {
    if (!window.confirm(`Delete department "${d.departmentName}"?`)) return;
    deleteMutation.mutate(d.id);
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="departments-header">
          Departments
        </h2>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={!defaultOrganizationId}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add department
        </Button>
      </div>
      {!defaultOrganizationId && (
        <p className="text-sm text-amber-700">
          Sign in with an organization context to create departments.
        </p>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <Layers className="h-5 w-5" />
            <span className="font-medium">Organization departments</span>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load departments."}
            </div>
          )}
          {!isLoading && !isError && departments.length === 0 && (
            <p className="py-8 text-center text-slate-500">No departments yet. Create one to get started.</p>
          )}
          {!isLoading && !isError && departments.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Organization ID</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">{d.departmentName}</TableCell>
                      <TableCell className="font-mono text-sm text-slate-600">
                        {d.organizationId}
                      </TableCell>
                      <TableCell className="text-slate-600">{d.createdAt}</TableCell>
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
                            <DropdownMenuItem onClick={() => setEditingDept(d)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(d)}
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

      <DepartmentFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultOrganizationId={defaultOrganizationId}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
      {editingDept && (
        <DepartmentFormDialog
          mode="edit"
          open={!!editingDept}
          onOpenChange={(open) => !open && setEditingDept(null)}
          initialValues={editingDept}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
