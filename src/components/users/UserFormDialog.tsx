import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User, CreateUserPayload, UpdateUserPayload } from "@/apis/types/users";
import { useDepartmentsList } from "@/apis/hooks/useDepartments";

const ROLE_OPTIONS = ["SuperAdmin", "Admin", "Driver", "Safety", "Operations"];

type UserFormDialogProps = (
  | {
      mode: "create";
      initialValues?: null;
      defaultOrganizationId: string;
      onSubmit: (payload: CreateUserPayload) => void;
    }
  | {
      mode: "edit";
      initialValues: User;
      onSubmit: (payload: UpdateUserPayload) => void;
    }
) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
};

export function UserFormDialog(props: UserFormDialogProps) {
  const { open, onOpenChange, isSubmitting } = props;
  const isEdit = props.mode === "edit";
  const title = isEdit ? "Edit user" : "Add user";
  const submitLabel = isEdit ? "Save" : "Create";

  const { data: departments = [] } = useDepartmentsList();
  const [role, setRole] = useState(isEdit ? props.initialValues.role : "");
  const [departmentId, setDepartmentId] = useState("");

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      setRole(props.initialValues.role);
      const match = departments.find(
        (d) => d.departmentName === props.initialValues.departmentName
      );
      setDepartmentId(match?.id ?? "");
    } else {
      setRole("");
      setDepartmentId("");
    }
    const form = document.getElementById("user-form") as HTMLFormElement | null;
    if (form) form.reset();
  }, [open, isEdit, props.mode === "edit" ? props.initialValues?.id : null, departments]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    if (!firstName || !lastName || !email) return;

    if (props.mode === "create") {
      const organizationId =
        (form.elements.namedItem("organizationId") as HTMLInputElement)?.value.trim() ||
        props.defaultOrganizationId;
      props.onSubmit({
        firstName,
        lastName,
        organizationId,
        departmentId: departmentId || "",
        role: role || "",
        email,
      });
    } else {
      props.onSubmit({
        id: props.initialValues.id,
        firstName,
        lastName,
        email,
        role: role || "",
        departmentId: departmentId || "",
        isActive: (form.elements.namedItem("isActive") as HTMLInputElement)?.checked ?? true,
      });
    }
  };

  const user = props.mode === "edit" ? props.initialValues : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form id="user-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name *</Label>
              <Input
                id="firstName"
                name="firstName"
                defaultValue={user?.firstName ?? ""}
                placeholder="First name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name *</Label>
              <Input
                id="lastName"
                name="lastName"
                defaultValue={user?.lastName ?? ""}
                placeholder="Last name"
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user?.email ?? ""}
              placeholder="email@example.com"
              required
            />
          </div>
          {props.mode === "create" && (
            <div className="grid gap-2">
              <Label htmlFor="organizationId">Organization ID *</Label>
              <Input
                id="organizationId"
                name="organizationId"
                defaultValue={props.defaultOrganizationId}
                placeholder="Organization ID"
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label>Department</Label>
            <Select value={departmentId || undefined} onValueChange={setDepartmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.departmentName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Role</Label>
            <Select value={role || undefined} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {props.mode === "edit" && (
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={user.isActive}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              Active
            </label>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
