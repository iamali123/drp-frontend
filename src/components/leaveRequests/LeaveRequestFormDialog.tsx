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
import type {
  LeaveRequest,
  CreateLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from "@/apis/types/leaveRequests";
import { useDriversList } from "@/apis/hooks/useDrivers";
import type { Driver } from "@/apis/types/drivers";

const LEAVE_TYPE_OPTIONS = ["DayOff", "SickLeave", "Emergency"];
const LEAVE_STATUS_OPTIONS = ["Pending", "Approved", "Denied"];

const isDefaultEmptyDate = (s: string | null | undefined) =>
  !s || s.startsWith("0001-01-01");

function getDriverValue(d: Driver): string {
  return d.id ?? d.samsaraDriverId ?? "";
}

type Props =
  | {
      mode: "create";
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: CreateLeaveRequestPayload) => void;
      isSubmitting: boolean;
    }
  | {
      mode: "edit";
      initialValues: LeaveRequest;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: UpdateLeaveRequestPayload) => void;
      isSubmitting: boolean;
    };

export function LeaveRequestFormDialog(props: Props) {
  const isEdit = props.mode === "edit";

  const [driverId, setDriverId] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [leaveStatus, setLeaveStatus] = useState("");
  const [approvedStartDate, setApprovedStartDate] = useState("");
  const [approvedEndDate, setApprovedEndDate] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");

  const { data: driversResponse, isLoading: driversLoading } = useDriversList({
    enabled: props.open && !isEdit,
  });
  const drivers = driversResponse?.data ?? [];

  useEffect(() => {
    if (!props.open) return;
    if (props.mode === "create") {
      const today = new Date().toISOString().slice(0, 10);
      setDriverId("");
      setLeaveType("");
      setReason("");
      setStartDate(today);
      setEndDate(today);
    } else {
      const row = props.initialValues;
      setLeaveStatus(row.leaveStatus || "Pending");
      setApprovedStartDate(
        isDefaultEmptyDate(row.approvedLeaveRequestStartDate)
          ? ""
          : (row.approvedLeaveRequestStartDate ?? "").slice(0, 10)
      );
      setApprovedEndDate(
        isDefaultEmptyDate(row.approvedLeaveRequestEndDate)
          ? ""
          : (row.approvedLeaveRequestEndDate ?? "").slice(0, 10)
      );
      setRejectionNotes(row.rejectionNotes ?? "");
    }
  }, [props.open, props.mode, props.mode === "edit" ? props.initialValues?.id : null]);

  const toISODate = (dateStr: string) =>
    dateStr ? new Date(dateStr + "T12:00:00.000Z").toISOString() : "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (props.mode === "create") {
      if (!driverId.trim() || !leaveType || !startDate || !endDate) return;
      (props as Extract<Props, { mode: "create" }>).onSubmit({
        driverId: driverId.trim(),
        leaveRequestStartDate: new Date(startDate).toISOString(),
        leaveRequestEndDate: new Date(endDate).toISOString(),
        leaveType,
        reason: reason.trim() || "",
      });
    } else {
      const id = (props as Extract<Props, { mode: "edit" }>).initialValues.id;
      (props as Extract<Props, { mode: "edit" }>).onSubmit({
        id,
        leaveStatus,
        approvedLeaveRequestStartDate: toISODate(approvedStartDate) || undefined,
        approvedLeaveRequestEndDate: toISODate(approvedEndDate) || undefined,
        rejectionNotes: rejectionNotes.trim() || undefined,
      });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit leave request" : "Create leave request"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          {isEdit ? (
            <>
              <div className="grid gap-2">
                <Label>Status *</Label>
                <Select
                  value={leaveStatus || undefined}
                  onValueChange={setLeaveStatus}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="approvedStartDate">Approved start date</Label>
                  <Input
                    id="approvedStartDate"
                    type="date"
                    value={approvedStartDate}
                    onChange={(e) => setApprovedStartDate(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="approvedEndDate">Approved end date</Label>
                  <Input
                    id="approvedEndDate"
                    type="date"
                    value={approvedEndDate}
                    onChange={(e) => setApprovedEndDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rejectionNotes">Rejection notes</Label>
                <Input
                  id="rejectionNotes"
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  placeholder="When denied"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-2">
                <Label>Driver *</Label>
                <Select
                  value={driverId || undefined}
                  onValueChange={setDriverId}
                  required
                  disabled={driversLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={driversLoading ? "Loading drivers…" : "Select driver"} />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => {
                      const value = getDriverValue(d);
                      if (!value) return null;
                      return (
                        <SelectItem key={value} value={value}>
                          {d.username}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Leave type *</Label>
                <Select value={leaveType || undefined} onValueChange={setLeaveType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Optional"
                />
              </div>
            </>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => props.onOpenChange(false)}
              disabled={props.isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                props.isSubmitting ||
                (isEdit ? !leaveStatus : !driverId || !leaveType)
              }
            >
              {props.isSubmitting ? (isEdit ? "Saving…" : "Creating…") : isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
