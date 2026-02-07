import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface MaintenanceRow {
  id: number;
  driver_id: number;
  driver_name: string;
  driver_score?: number;
  month?: number;
  year?: number;
  [key: string]: unknown;
}

export function MaintenanceScorePage() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [year, setYear] = useState(() => new Date().getFullYear());

  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
      month: String(month),
      year: String(year),
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/maintainance_scores.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as MaintenanceRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<MaintenanceRow>[] = [
    { key: "id", header: "SCORE ID" },
    { key: "driver_id", header: "DRIVER ID" },
    { key: "driver_name", header: "DRIVER NAME" },
    { key: "driver_score", header: "MAINTENANCE SCORE" },
    { key: "month", header: "SCORE MONTH" },
    { key: "year", header: "SCORE YEAR" },
    {
      key: "show_driver",
      header: "SHOW DRIVER",
      render: (row) => (
        <Button asChild size="sm" variant="outline">
          <Link to={`/admin/driver-list?driver_id=${row.driver_id}`}>Show</Link>
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Maintenance Score</h2>
        <Button asChild size="sm">
          <Link to="/admin/maintenance/new">Add Maintenance Score</Link>
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>Maintenance</strong> data is of month: <em>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</em> and year: <em>{year}</em>
      </p>

      <Card>
        <CardContent className="pt-4">
          <DataTable<MaintenanceRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search here…"
            extraParams={{ month, year }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

