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
import type {
  Department,
  CreateDepartmentPayload,
  UpdateDepartmentPayload,
} from "@/apis/types/departments";

type DepartmentFormDialogProps = (
  | {
      mode: "create";
      initialValues?: null;
      defaultOrganizationId: string;
      onSubmit: (payload: CreateDepartmentPayload) => void;
    }
  | {
      mode: "edit";
      initialValues: Department;
      onSubmit: (payload: UpdateDepartmentPayload) => void;
    }
) & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSubmitting: boolean;
};

export function DepartmentFormDialog(props: DepartmentFormDialogProps) {
  const { open, onOpenChange, isSubmitting } = props;
  const isEdit = props.mode === "edit";
  const title = isEdit ? "Edit department" : "Add department";
  const submitLabel = isEdit ? "Save" : "Create";

  const [departmentName, setDepartmentName] = useState(
    isEdit ? props.initialValues.departmentName : ""
  );

  useEffect(() => {
    if (!open) return;
    if (props.mode === "edit") {
      setDepartmentName(props.initialValues.departmentName);
    } else {
      setDepartmentName("");
    }
    const form = document.getElementById("department-form") as HTMLFormElement | null;
    if (form) form.reset();
  }, [open, isEdit, props.mode === "edit" ? props.initialValues?.id : null]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = departmentName.trim();
    if (!name) return;

    if (props.mode === "create") {
      props.onSubmit({
        departmentName: name,
        organizationId: props.defaultOrganizationId,
      });
    } else {
      props.onSubmit({
        id: props.initialValues.id,
        departmentName: name,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form id="department-form" onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="departmentName">Department name *</Label>
            <Input
              id="departmentName"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              placeholder="e.g. Safety, Operations"
              required
            />
          </div>
          {props.mode === "create" && (
            <p className="text-xs text-slate-500">
              Organization: {props.defaultOrganizationId || "—"}
            </p>
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
            <Button type="submit" disabled={isSubmitting || !departmentName.trim()}>
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
