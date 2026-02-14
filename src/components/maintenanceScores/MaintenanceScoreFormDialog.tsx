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
import type { MaintenanceScore, UpdateMaintenanceScorePayload } from "@/apis/types/maintenanceScores";

interface MaintenanceScoreFormDialogProps {
  initialValues: MaintenanceScore;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: UpdateMaintenanceScorePayload) => void;
  isSubmitting: boolean;
  updatedBy: string;
}

export function MaintenanceScoreFormDialog({
  initialValues,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  updatedBy,
}: MaintenanceScoreFormDialogProps) {
  const [driverId, setDriverId] = useState(initialValues.driverId);
  const [month, setMonth] = useState(
    initialValues.month ? initialValues.month.slice(0, 7) : "" // yyyy-MM for month
  );
  const [score, setScore] = useState(String(initialValues.score));

  useEffect(() => {
    if (!open) return;
    setDriverId(initialValues.driverId);
    setMonth(initialValues.month ? initialValues.month.slice(0, 7) : "");
    setScore(String(initialValues.score));
  }, [open, initialValues.id, initialValues.driverId, initialValues.month, initialValues.score]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numScore = parseInt(score, 10);
    const monthISO = month ? new Date(month + "-01T12:00:00.000Z").toISOString() : "";
    onSubmit({
      id: initialValues.id,
      driverId: driverId.trim(),
      month: monthISO,
      score: Number.isFinite(numScore) ? numScore : 0,
      updatedBy: updatedBy.trim() || "System",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Update maintenance score</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="ms-driverId">Driver ID *</Label>
            <Input
              id="ms-driverId"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-month">Month *</Label>
            <Input
              id="ms-month"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-score">Score *</Label>
            <Input
              id="ms-score"
              type="number"
              min={0}
              value={score}
              onChange={(e) => setScore(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ms-updatedBy">Updated by *</Label>
            <Input
              id="ms-updatedBy"
              value={updatedBy}
              readOnly
              className="bg-slate-50"
            />
          </div>
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
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
