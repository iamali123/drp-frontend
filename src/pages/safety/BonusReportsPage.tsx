import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import { Link } from "react-router-dom";

const base = import.meta.env.VITE_API_BASE || "";

interface BonusRow {
  id: number;
  driver_id: number;
  driver_name: string;
  driver_type?: string;
  domicile?: string;
  drp_score?: number;
  total_bonus?: number;
  driver_image?: string;
  [key: string]: unknown;
}

export function BonusReportsPage() {
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
    const res = await fetch(`${base}/bonus_structures.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as BonusRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<BonusRow>[] = [
    { key: "id", header: "REPORT ID" },
    {
      key: "driver_image",
      header: "PHOTO",
      render: (row) =>
        row.driver_image ? (
          <img src={String(row.driver_image)} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    { key: "driver_name", header: "DRIVER NAME" },
    { key: "driver_id", header: "DRIVER ID" },
    { key: "driver_type", header: "TYPE" },
    { key: "domicile", header: "DOMICILE" },
    { key: "drp_score", header: "DRP SCORE" },
    { key: "total_bonus", header: "BONUS" },
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
        <h2 className="text-xl font-semibold text-slate-900">Bonus Report</h2>
        <div className="flex gap-2">
          <Button size="sm">Upload Bonus Report</Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/admin/bonus-reports/new">Add Bonus</Link>
          </Button>
        </div>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>BonusReport</strong> data is of month: <em>{new Date(year, month - 1).toLocaleString("default", { month: "long" })}</em> and year: <em>{year}</em>
      </p>

      <div className="flex flex-wrap items-center gap-4">
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
          <DataTable<BonusRow>
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
