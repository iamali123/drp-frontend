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
import type { LeaveLimit, CreateLeaveLimitPayload, UpdateLeaveLimitPayload } from "@/apis/types/leaveLimits";
import { useStates } from "@/apis/hooks/useUsers";

const DRIVER_TYPE_OPTIONS = ["Local", "Regional"];

type Props =
  | {
      mode: "create";
      initialValues?: null;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: CreateLeaveLimitPayload) => void;
      isSubmitting: boolean;
    }
  | {
      mode: "edit";
      initialValues: LeaveLimit;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      onSubmit: (payload: UpdateLeaveLimitPayload) => void;
      isSubmitting: boolean;
    };

const COUNTRY_CODE = "US";

export function LeaveLimitFormDialog(props: Props) {
  const isEdit = props.mode === "edit";
  const { data: stateOptions = [], isLoading: statesLoading } = useStates(COUNTRY_CODE, {
    enabled: props.open,
  });
  const [driverType, setDriverType] = useState(isEdit ? props.initialValues.driverType : "");
  const [domicile, setDomicile] = useState(isEdit ? props.initialValues.domicile : "");
  const [maxDriverOff, setMaxDriverOff] = useState(
    isEdit ? String(props.initialValues.maxDriverOff) : ""
  );
  const [startDate, setStartDate] = useState(
    isEdit && props.initialValues.startDate
      ? props.initialValues.startDate.slice(0, 10)
      : ""
  );
  const [endDate, setEndDate] = useState(
    isEdit && props.initialValues.endDate ? props.initialValues.endDate.slice(0, 10) : ""
  );

  useEffect(() => {
    if (!props.open) return;
    if (props.mode === "edit" && props.initialValues) {
      setDriverType(props.initialValues.driverType);
      setDomicile(props.initialValues.domicile);
      setMaxDriverOff(String(props.initialValues.maxDriverOff));
      setStartDate(props.initialValues.startDate?.slice(0, 10) ?? "");
      setEndDate(props.initialValues.endDate?.slice(0, 10) ?? "");
    } else {
      setDriverType("");
      setDomicile("");
      setMaxDriverOff("");
      setStartDate("");
      setEndDate("");
    }
  }, [props.open, props.mode, props.mode === "edit" ? props.initialValues?.id : null]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const max = parseInt(maxDriverOff, 10);
    if (isEdit && props.mode === "edit" && props.initialValues) {
      props.onSubmit({
        id: props.initialValues.id,
        driverType,
        domicile,
        maxDriverOff: Number.isFinite(max) ? max : 0,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
    } else if (props.mode === "create") {
      props.onSubmit({
        driverType,
        domicile,
        maxDriverOff: Number.isFinite(max) ? max : 0,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit leave limit" : "Add leave limit"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label>Driver type *</Label>
            <Select value={driverType || undefined} onValueChange={setDriverType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {DRIVER_TYPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Domicile *</Label>
            <Select
              value={domicile || undefined}
              onValueChange={setDomicile}
              required
              disabled={statesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={statesLoading ? "Loading…" : "Select domicile"} />
              </SelectTrigger>
              <SelectContent>
                {stateOptions.map((s) => {
                  const value = `${s.code}-${s.name}`;
                  return (
                    <SelectItem key={value} value={value}>
                      {s.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="maxDriverOff">Max drivers off *</Label>
            <Input
              id="maxDriverOff"
              type="number"
              min={0}
              value={maxDriverOff}
              onChange={(e) => setMaxDriverOff(e.target.value)}
              required
            />
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
