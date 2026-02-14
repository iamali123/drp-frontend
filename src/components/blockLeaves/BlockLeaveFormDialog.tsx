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
  BlockLeave,
  CreateBlockLeavePayload,
  UpdateBlockLeavePayload,
} from "@/apis/types/blockLeaves";

type Props =
  | {
      mode: "create";
      initialValues?: null;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: CreateBlockLeavePayload) => void;
      isSubmitting: boolean;
      organizationId: string;
    }
  | {
      mode: "edit";
      initialValues: BlockLeave;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: UpdateBlockLeavePayload) => void;
      isSubmitting: boolean;
      organizationId?: string;
    };

export function BlockLeaveFormDialog(props: Props) {
  const isEdit = props.mode === "edit";
  const [reason, setReason] = useState(
    isEdit && props.initialValues ? props.initialValues.reason : ""
  );
  const [startDate, setStartDate] = useState(
    isEdit && props.initialValues?.startDate
      ? props.initialValues.startDate.slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    isEdit && props.initialValues?.endDate
      ? props.initialValues.endDate.slice(0, 10)
      : ""
  );

  useEffect(() => {
    if (!props.open) return;
    if (props.mode === "edit" && props.initialValues) {
      setReason(props.initialValues.reason);
      setStartDate(props.initialValues.startDate?.slice(0, 10) ?? "");
      setEndDate(props.initialValues.endDate?.slice(0, 10) ?? "");
    } else {
      setReason("");
      setStartDate("");
      setEndDate("");
    }
  }, [props.open, props.mode, props.mode === "edit" ? props.initialValues?.id : null]);

  // API requires full ISO datetime (e.g. 2026-02-14T11:57:05.141Z) for both create and update
  const toISODateTime = (dateStr: string): string => {
    if (!dateStr) return "";
    const iso = dateStr.includes("T")
      ? new Date(dateStr).toISOString()
      : new Date(dateStr + "T12:00:00.000Z").toISOString();
    return iso;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateISO = toISODateTime(startDate);
    const endDateISO = toISODateTime(endDate);
    if (isEdit && props.mode === "edit" && props.initialValues) {
      props.onSubmit({
        id: props.initialValues.id,
        organizationId: props.initialValues.organizationId,
        reason,
        startDate: startDateISO,
        endDate: endDateISO,
      });
    } else if (props.mode === "create") {
      props.onSubmit({
        organizationId: props.organizationId,
        reason,
        startDate: startDateISO,
        endDate: endDateISO,
      });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit block leave" : "Add block leave"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="block-reason">Reason *</Label>
            <Input
              id="block-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Company shutdown"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="block-startDate">Start date *</Label>
              <Input
                id="block-startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="block-endDate">End date *</Label>
              <Input
                id="block-endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onOpenChange(false)}
              disabled={props.isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={props.isSubmitting}>
              {props.isSubmitting ? "Saving…" : isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
