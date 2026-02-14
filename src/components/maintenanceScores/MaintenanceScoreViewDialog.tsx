import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MaintenanceScore } from "@/apis/types/maintenanceScores";

function formatDate(dateString: string) {
  return dateString ? new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long" }) : "—";
}

interface MaintenanceScoreViewDialogProps {
  score: MaintenanceScore | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
}

export function MaintenanceScoreViewDialog({
  score,
  open,
  onOpenChange,
  isLoading,
}: MaintenanceScoreViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>View maintenance score</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
          </div>
        ) : !score ? (
          <p className="py-4 text-sm text-slate-500">Score not found.</p>
        ) : (
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
            <span className="text-slate-500">Score ID</span>
            <span className="font-medium">{score.id}</span>
            <span className="text-slate-500">Driver ID</span>
            <span>{score.driverId}</span>
            <span className="text-slate-500">Month</span>
            <span>{formatDate(score.month)}</span>
            <span className="text-slate-500">Score</span>
            <span>{score.score}</span>
            <span className="text-slate-500">Updated by</span>
            <span>{score.updatedBy ?? "—"}</span>
            <span className="text-slate-500">Created</span>
            <span>{score.createdAt ? new Date(score.createdAt).toLocaleString() : "—"}</span>
          </div>
          {score.maintenanceNotes && score.maintenanceNotes.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">Maintenance notes</p>
              <ul className="max-h-40 space-y-1 overflow-y-auto rounded border border-slate-200 bg-slate-50 p-2 text-sm">
                {score.maintenanceNotes.map((note) => (
                  <li key={note.maintenanceNoteId} className="flex justify-between gap-2">
                    <span>{note.noteDescription}</span>
                    <span className="text-slate-500">Score: {note.noteScore}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
