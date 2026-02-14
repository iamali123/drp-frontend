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
  ScoreNote,
  CreateScoreNotePayload,
  UpdateScoreNotePayload,
} from "@/apis/types/scoreNotes";

const SCORE_NOTES_TYPES = ["Maintenance", "Operations"];

type ScoreNoteFormDialogProps =
  | {
      mode: "create";
      initialValues?: never;
      onSubmit: (payload: CreateScoreNotePayload) => void;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      isSubmitting: boolean;
    }
  | {
      mode: "edit";
      initialValues: ScoreNote;
      onSubmit: (payload: UpdateScoreNotePayload) => void;
      open: boolean;
      onOpenChange: (open: boolean) => void;
      isSubmitting: boolean;
    };

export function ScoreNoteFormDialog({
  open,
  onOpenChange,
  mode,
  initialValues,
  onSubmit,
  isSubmitting,
}: ScoreNoteFormDialogProps) {
  const [description, setDescription] = useState(
    mode === "edit" ? initialValues.description : ""
  );
  const [score, setScore] = useState(
    mode === "edit" ? String(initialValues.score) : ""
  );
  const [scoreNotesType, setScoreNotesType] = useState(
    mode === "edit" ? initialValues.scoreNotesType : "Maintenance"
  );

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialValues) {
      setDescription(initialValues.description);
      setScore(String(initialValues.score));
      setScoreNotesType(initialValues.scoreNotesType);
    } else {
      setDescription("");
      setScore("");
      setScoreNotesType("Maintenance");
    }
  }, [open, mode, mode === "edit" ? initialValues?.id : undefined]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const scoreNum = Number(score);
    if (isNaN(scoreNum)) return;
    if (mode === "create") {
      onSubmit({
        description: description.trim(),
        score: scoreNum,
        scoreNotesType: scoreNotesType || "Maintenance",
      });
    } else {
      onSubmit({
        id: initialValues.id,
        description: description.trim(),
        score: scoreNum,
        scoreNotesType: scoreNotesType || "Maintenance",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create score note" : "Edit score note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Accident, Cooperative"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="score">Score *</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. -4, 3"
              required
            />
            <p className="text-xs text-slate-500">Can be positive or negative</p>
          </div>
          <div className="grid gap-2">
            <Label>Type *</Label>
            <Select value={scoreNotesType || undefined} onValueChange={setScoreNotesType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {SCORE_NOTES_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button type="submit" disabled={isSubmitting || !description.trim()}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
