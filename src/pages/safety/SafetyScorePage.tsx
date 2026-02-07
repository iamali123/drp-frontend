import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface SafetyRow {
  id: number;
  driver_id: number;
  driver_name: string;
  joyride_score?: number;
  safety_score?: number;
  anticipation_score?: number;
  idle_score?: number;
  driver_efficiency_score?: number;
  over_speed_score?: number;
  [key: string]: unknown;
}

export function SafetyScorePage() {
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
    const res = await fetch(`${base}/joyride_safety_scores.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as SafetyRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<SafetyRow>[] = [
    { key: "id", header: "SCORE ID" },
    { key: "driver_id", header: "DRIVER ID" },
    { key: "driver_name", header: "DRIVER NAME" },
    { key: "joyride_score", header: "SAFETY" },
    { key: "safety_score", header: "ALERTNESS" },
    { key: "anticipation_score", header: "ANTICIPATION" },
    { key: "idle_score", header: "IDLING" },
    { key: "driver_efficiency_score", header: "EFFICIENCY" },
    { key: "over_speed_score", header: "SPEEDING" },
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
        <h2 className="text-xl font-semibold text-slate-900">Safety Score</h2>
        <Button asChild size="sm">
          <Link to="/admin/safety/new">Add Safety Score</Link>
        </Button>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>Safety</strong> data is of month: <em>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</em> and year: <em>{year}</em>
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm text-slate-600">
          Month
          <Input
            type="number"
            placeholder="Month"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(Number(e.target.value) || 1)}
            className="ml-2 w-24"
          />
        </label>
        <label className="text-sm text-slate-600">
          Year
          <Input
            type="number"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())}
            className="ml-2 w-24"
          />
        </label>
      </div>

      <Card>
        <CardContent className="pt-4">
          <DataTable<SafetyRow>
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
