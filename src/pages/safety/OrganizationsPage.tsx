import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Building2, MoreHorizontal, Pencil, Trash2, Plus } from "lucide-react";
import {
  useOrganizationsList,
  useCreateOrganization,
  useUpdateOrganization,
  useDeleteOrganization,
} from "@/apis/hooks/useOrganizations";
import type {
  Organization,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
} from "@/apis/types/organizations";
import { OrganizationFormDialog } from "@/components/organizations/OrganizationFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";

export function OrganizationsPage() {
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const { data: organizations = [], isLoading, isError, error, refetch } = useOrganizationsList();
  const createMutation = useCreateOrganization({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "Organization created successfully." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateOrganization({
    onSuccess: () => {
      setEditingOrg(null);
      setFlash({ type: "success", message: "Organization updated successfully." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteOrganization({
    onSuccess: () => {
      setFlash({ type: "success", message: "Organization deleted." });
      refetch();
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleCreate = (payload: OrganizationCreatePayload) => {
    createMutation.mutate(payload);
  };
  const handleUpdate = (payload: OrganizationUpdatePayload) => {
    if (!editingOrg?.id) return;
    updateMutation.mutate({ id: payload.id, payload });
  };
  const handleDelete = (org: Organization) => {
    if (!window.confirm(`Delete "${org.name}"?`)) return;
    deleteMutation.mutate(org.id);
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="organizations-header">
          Organizations
        </h2>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add organization
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-slate-600">
            <Building2 className="h-5 w-5" />
            <span className="font-medium">All organizations</span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load organizations."}
            </div>
          )}
          {!isLoading && !isError && organizations.length === 0 && (
            <p className="py-8 text-center text-slate-500">No organizations yet. Create one to get started.</p>
          )}
          {!isLoading && !isError && organizations.length > 0 && (
            <div className="overflow-x-auto rounded-md border border-slate-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>DOT / MC</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Billing</TableHead>
                    <TableHead className="text-right">Seats</TableHead>
                    <TableHead>Telematics</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {organizations.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell className="max-w-[180px] truncate text-slate-600">
                        {org.address || "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {org.companyContactName || "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {org.dotNumber || "—"} / {org.mcNumber || "—"}
                      </TableCell>
                      <TableCell>
                        {org.accountStatus ? (
                          <Badge variant="secondary">{org.accountStatus}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {org.billingStatus ? (
                          <Badge variant="outline">{org.billingStatus}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {org.maxDriverSeats ?? "—"}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {org.telematicsProvider || "—"}
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
                            <DropdownMenuItem onClick={() => setEditingOrg(org)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(org)}
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

      <OrganizationFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Add organization"
        submitLabel="Create"
        initialValues={undefined}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
      {editingOrg && (
        <OrganizationFormDialog
          mode="edit"
          open={!!editingOrg}
          onOpenChange={(open) => !open && setEditingOrg(null)}
          title="Edit organization"
          submitLabel="Save"
          initialValues={editingOrg}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}
