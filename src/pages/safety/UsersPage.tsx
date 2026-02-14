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
import { UserFormDialog } from "@/components/users/UserFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import { useAuth } from "@/lib/auth";
import {
  useUsersList,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/apis/hooks/useUsers";
import { useOrganizationsList } from "@/apis/hooks/useOrganizations";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/apis/types/users";
import { MoreHorizontal, Plus, Pencil, Trash2, Users } from "lucide-react";

export function UsersPage() {
  const { user: authUser } = useAuth();
  const defaultOrganizationId = authUser?.organizationId ?? "";
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: organizations = [] } = useOrganizationsList();
  const { data: users = [], isLoading, isError, error, refetch } = useUsersList();
  const createMutation = useCreateUser({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "User created successfully." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateUser({
    onSuccess: () => {
      setEditingUser(null);
      setFlash({ type: "success", message: "User updated successfully." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteUser({
    onSuccess: () => {
      setFlash({ type: "success", message: "User removed." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleCreate = (payload: CreateUserPayload) => {
    createMutation.mutate(payload);
  };
  const handleUpdate = (payload: UpdateUserPayload) => {
    updateMutation.mutate({ id: payload.id, payload });
  };
  const handleDelete = (u: User) => {
    if (!window.confirm(`Remove user "${u.firstName} ${u.lastName}"?`)) return;
    deleteMutation.mutate(u.id);
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="users-header">
          Users
        </h2>
        <Button
          onClick={() => setCreateOpen(true)}
          disabled={organizations.length === 0}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>
      {organizations.length === 0 && (
        <p className="text-sm text-amber-700">
          No organizations available. Create an organization first to add users.
        </p>
      )}

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <Users className="h-5 w-5" />
            <span className="font-medium">Organization users</span>
          </div>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load users."}
            </div>
          )}
          {!isLoading && !isError && users.length === 0 && (
            <p className="py-8 text-center text-slate-500">No users found.</p>
          )}
          {!isLoading && !isError && users.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.firstName} {u.lastName}
                      </TableCell>
                      <TableCell className="text-slate-600">{u.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{u.role}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {u.departmentName || "—"}
                      </TableCell>
                      <TableCell>
                        {!u.isActive ? (
                          <Badge variant="outline" className="text-slate-500">
                            Inactive
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-600">
                            Active
                          </Badge>
                        )}
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
                            <DropdownMenuItem onClick={() => setEditingUser(u)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(u)}
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

      <UserFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        organizations={organizations}
        defaultOrganizationId={defaultOrganizationId}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
      {editingUser && (
        <UserFormDialog
          mode="edit"
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          initialValues={editingUser}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
