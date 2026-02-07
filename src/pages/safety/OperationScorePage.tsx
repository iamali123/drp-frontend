import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface OperationRow {
  id: number;
  driver_id: number;
  driver_name: string;
  driver_score?: number;
  month?: number;
  year?: number;
  [key: string]: unknown;
}

export function OperationScorePage() {
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
    const res = await fetch(`${base}/operation_scores.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as OperationRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<OperationRow>[] = [
    { key: "id", header: "SCORE ID" },
    { key: "driver_id", header: "DRIVER ID" },
    { key: "driver_name", header: "DRIVER NAME" },
    { key: "driver_score", header: "OPERATIONS SCORE" },
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
        <h2 className="text-xl font-semibold text-slate-900">Operations Score</h2>
        <Button asChild size="sm">
          <Link to="/admin/operations/new">Add Operation Score</Link>
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>Operations</strong> data is of month: <em>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</em> and year: <em>{year}</em>
      </p>

      <Card>
        <CardContent className="pt-4">
          <DataTable<OperationRow>
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
