import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface LeaveRow {
  id: number;
  leave_type?: string;
  apply_date?: string;
  leave_dates?: string;
  final_status?: string;
  leave_final_dates?: string;
  total_leave_days?: number;
  reason?: string;
  document_status?: string;
  [key: string]: unknown;
}

export function DriverLeaveRequests() {
  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/leave_requests.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as LeaveRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<LeaveRow>[] = [
    { key: "leave_type", header: "Leave Type" },
    { key: "apply_date", header: "Apply Date" },
    { key: "leave_dates", header: "Leave Dates" },
    {
      key: "final_status",
      header: "Final Status",
      render: (row) => (
        <Badge
          variant={
            row.final_status === "Approved"
              ? "success"
              : row.final_status === "Denied"
                ? "destructive"
                : "secondary"
          }
        >
          {String(row.final_status ?? "—")}
        </Badge>
      ),
    },
    { key: "leave_final_dates", header: "Final Dates" },
    { key: "total_leave_days", header: "Total Days" },
    { key: "reason", header: "Reason" },
    { key: "document_status", header: "Document Status" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Button asChild size="sm" variant="outline">
          <Link to={`/driver/leave-requests/${row.id}`}>View</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 p-4">
        <h2 className="text-xl font-semibold text-slate-900">Leave Requests</h2>
        <Button asChild size="sm">
          <Link to="/driver/leave-requests/new">Make Leave Request</Link>
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to="/driver/leave-requests/calendar">Calendar View</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <DataTable<LeaveRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search…"
          />
        </CardContent>
      </Card>
    </div>
  );
}
