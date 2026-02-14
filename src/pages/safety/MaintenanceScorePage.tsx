import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { maintenanceScoresService } from "@/apis/services/maintenanceScores";
import {
  useMaintenanceScore,
  useUpdateMaintenanceScore,
} from "@/apis/hooks/useMaintenanceScores";
import type { MaintenanceScore } from "@/apis/types/maintenanceScores";
import { MaintenanceScoreViewDialog } from "@/components/maintenanceScores/MaintenanceScoreViewDialog";
import { MaintenanceScoreFormDialog } from "@/components/maintenanceScores/MaintenanceScoreFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { MoreHorizontal, Eye, Pencil, User } from "lucide-react";

export function MaintenanceScorePage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<MaintenanceScore | null>(null);

  const { user } = useAuth();
  const updatedBy = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "System";

  const { data: viewScore, isLoading: viewLoading } = useMaintenanceScore(viewId);
  const updateMutation = useUpdateMaintenanceScore({
    onSuccess: () => {
      setEditingScore(null);
      setFlash({ type: "success", message: "Maintenance score updated." });
      setRefreshKey((k) => k + 1);
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const res = await maintenanceScoresService.listOrganizationMaintenanceScores({
      pageIndex: params.page,
      pageSize: params.perPage,
      driverId: params.search,
    });
    let scores = res.data || [];
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      scores = scores.filter(
        (s) =>
          s.driverId.toLowerCase().includes(searchLower) ||
          s.score.toString().includes(searchLower)
      );
    }
    return { data: scores, total: res.totalCount || scores.length };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long" });
  };

  const handleUpdate = (payload: { id: string; driverId: string; month: string; score: number; updatedBy: string }) => {
    updateMutation.mutate({ id: payload.id, payload });
  };

  const columns: Column<MaintenanceScore>[] = [
    { key: "id", header: "SCORE ID" },
    { key: "driverId", header: "DRIVER ID" },
    {
      key: "month",
      header: "MONTH",
      render: (row) => formatDate(row.month),
    },
    { key: "score", header: "MAINTENANCE SCORE" },
    { key: "updatedBy", header: "UPDATED BY" },
    {
      key: "maintenanceNotes",
      header: "NOTES COUNT",
      render: (row) => row.maintenanceNotes?.length || 0,
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setViewId(row.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditingScore(row)} disabled={updateMutation.isPending}>
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`/admin/driver-list?driver_id=${row.driverId}`} className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Show driver
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Maintenance Score</h2>
      </div>

      <Card>
        <CardContent className="pt-4">
          <DataTable<MaintenanceScore>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search by Driver ID…"
            extraParams={{ refreshKey }}
          />
        </CardContent>
      </Card>

      <MaintenanceScoreViewDialog
        score={viewId && viewScore ? viewScore : null}
        open={!!viewId}
        onOpenChange={(open) => !open && setViewId(null)}
        isLoading={!!viewId && viewLoading}
      />

      {editingScore && (
        <MaintenanceScoreFormDialog
          initialValues={editingScore}
          open={!!editingScore}
          onOpenChange={(open) => !open && setEditingScore(null)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
          updatedBy={updatedBy}
        />
      )}
    </div>
  );
}
