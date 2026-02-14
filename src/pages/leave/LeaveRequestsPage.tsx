import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  useLeaveRequestsList,
  useCreateLeaveRequest,
  useUpdateLeaveRequest,
  useDeleteLeaveRequest,
} from "@/apis/hooks/useLeaveRequests";
import type {
  LeaveRequest,
  CreateLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from "@/apis/types/leaveRequests";
import { LeaveRequestFormDialog } from "@/components/leaveRequests/LeaveRequestFormDialog";
import { FlashMessage } from "@/components/global/FlashMessage";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

export function LeaveRequestsPage() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [option, setOption] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { data: allLeaveRequests = [], isLoading } = useLeaveRequestsList();
  const createMutation = useCreateLeaveRequest({
    onSuccess: () => {
      setCreateOpen(false);
      setFlash({ type: "success", message: "Leave request created successfully." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const updateMutation = useUpdateLeaveRequest({
    onSuccess: () => {
      setEditingRequest(null);
      setFlash({ type: "success", message: "Leave request updated." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });
  const deleteMutation = useDeleteLeaveRequest({
    onSuccess: () => setFlash({ type: "success", message: "Leave request deleted." }),
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  const handleUpdate = (payload: UpdateLeaveRequestPayload) => {
    updateMutation.mutate({ id: payload.id, payload });
  };
  const handleDelete = (row: LeaveRequest) => {
    if (window.confirm(`Delete leave request for ${row.driverId} (${row.leaveType})?`)) {
      deleteMutation.mutate(row.id);
    }
  };

  // Filter and format data for the table
  const filteredData = useMemo(() => {
    let filtered = allLeaveRequests;

    // Filter by status
    if (option === "pending") {
      filtered = filtered.filter((req) => !req.leaveStatus || req.leaveStatus === "Pending");
    } else if (option === "approved") {
      filtered = filtered.filter((req) => req.leaveStatus === "Approved");
    } else if (option === "denied") {
      filtered = filtered.filter((req) => req.leaveStatus === "Denied");
    }

    // Filter by month/year
    filtered = filtered.filter((req) => {
      const startDate = new Date(req.leaveRequestStartDate);
      return (
        startDate.getMonth() + 1 === month && startDate.getFullYear() === year
      );
    });

    return filtered;
  }, [allLeaveRequests, month, year, option]);

  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    let data = filteredData;

    // Client-side search
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      data = data.filter(
        (req) =>
          req.driverId.toLowerCase().includes(searchLower) ||
          req.leaveType.toLowerCase().includes(searchLower) ||
          req.reason.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const start = (params.page - 1) * params.perPage;
    const end = start + params.perPage;
    const paginatedData = data.slice(start, end);

    return { data: paginatedData, total: data.length };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isDefaultEmptyDate = (s: string | null | undefined) =>
    !s || s.startsWith("0001-01-01");

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const columns: Column<LeaveRequest>[] = [
    { key: "driverId", header: "Driver ID" },
    { key: "leaveType", header: "Leave Type" },
    {
      key: "applyDates",
      header: "Apply Date",
      render: (row) =>
        row.applyDates ? formatDate(row.applyDates) : formatDate(row.leaveRequestStartDate),
    },
    {
      key: "leaveRequestStartDate",
      header: "Request Dates",
      render: (row) =>
        `${formatDate(row.leaveRequestStartDate)} - ${formatDate(row.leaveRequestEndDate)}`,
    },
    {
      key: "leaveStatus",
      header: "Status",
      render: (row) => {
        const status = row.leaveStatus || "Pending";
        return (
          <Badge
            variant={
              status === "Approved"
                ? "outline"
                : status === "Denied"
                  ? "secondary"
                  : "secondary"
            }
            className={
              status === "Approved"
                ? "text-emerald-600"
                : status === "Denied"
                  ? "text-red-600"
                  : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      key: "approvedLeaveRequestStartDate",
      header: "Approved Dates",
      render: (row) => {
        const start = row.approvedLeaveRequestStartDate;
        const end = row.approvedLeaveRequestEndDate;
        if (isDefaultEmptyDate(start) || isDefaultEmptyDate(end)) return "—";
        return `${formatDate(start!)} - ${formatDate(end!)}`;
      },
    },
    {
      key: "leaveRequestStartDate",
      header: "Total Days",
      render: (row) => calculateDays(row.leaveRequestStartDate, row.leaveRequestEndDate),
    },
    { key: "reason", header: "Reason" },
    {
      key: "rejectionNotes",
      header: "Rejection Notes",
      render: (row) => row.rejectionNotes ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
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
            <DropdownMenuItem
              onClick={() => setEditingRequest(row)}
              disabled={deleteMutation.isPending}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row)}
              disabled={deleteMutation.isPending}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handleCreate = (payload: CreateLeaveRequestPayload) => {
    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Leave Requests</h2>
        <div className="flex gap-2">
          <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create leave request
          </Button>
          {/* <Button variant="outline" size="sm">Calendar</Button>
          <Button variant="outline" size="sm">Leave Summary</Button>
          <Button variant="outline" size="sm">Statistics</Button> */}
        </div>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>LeaveRequest</strong> data is of month: <em>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</em> and year: <em>{year}</em>
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <select
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={option}
          onChange={(e) => setOption(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
        <input
          type="number"
          min={1}
          max={12}
          value={month}
          onChange={(e) => setMonth(Number(e.target.value) || 1)}
          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())}
          className="w-24 rounded-md border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>

      <Card>
        <CardContent className="pt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          ) : (
            <DataTable<LeaveRequest>
              columns={columns}
              fetchData={fetchData}
              searchPlaceholder="Search by Driver ID, Type, or Reason…"
              extraParams={{ month, year, option }}
            />
          )}
        </CardContent>
      </Card>

      <LeaveRequestFormDialog
        mode="create"
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        isSubmitting={createMutation.isPending}
      />
      {editingRequest && (
        <LeaveRequestFormDialog
          mode="edit"
          initialValues={editingRequest}
          open={!!editingRequest}
          onOpenChange={(open) => !open && setEditingRequest(null)}
          onSubmit={handleUpdate}
          isSubmitting={updateMutation.isPending}
        />
      )}
    </div>
  );
}

