import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface LeaveRow {
  id: number;
  driver_id?: number;
  driver_name?: string;
  driver_type?: string;
  domicile?: string;
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

export function LeaveRequestsPage() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [option, setOption] = useState("");

  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
      month: String(month),
      year: String(year),
      option,
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/leave_requests.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as LeaveRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<LeaveRow>[] = [
    { key: "driver_id", header: "Driver ID" },
    { key: "driver_name", header: "Full Name" },
    { key: "driver_type", header: "Driver Type" },
    { key: "domicile", header: "Domicile" },
    { key: "leave_type", header: "Type" },
    { key: "apply_date", header: "Apply Date" },
    { key: "leave_dates", header: "Dates" },
    {
      key: "final_status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.final_status === "Approved" ? "success" : row.final_status === "Denied" ? "destructive" : "secondary"}>
          {String(row.final_status ?? "—")}
        </Badge>
      ),
    },
    { key: "leave_final_dates", header: "Final Dates" },
    { key: "total_leave_days", header: "Total Days" },
    { key: "reason", header: "Reason" },
    { key: "document_status", header: "Document Status" },
    {
      key: "manage",
      header: "Manage Request",
      render: (row) => (
        <Button asChild size="sm" variant="outline">
          <Link to={`/admin/leave-requests/${row.id}`}>Manage</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Leave Requests</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Calendar</Button>
          <Button variant="outline" size="sm">Leave Summary</Button>
          <Button variant="outline" size="sm">Statistics</Button>
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
          <DataTable<LeaveRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search here…"
            extraParams={{ month, year, option }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

