import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/global/DataTable";

const base = import.meta.env.VITE_API_BASE || "";

interface BonusRow {
  id: number;
  driver_id: number;
  total_bonus?: number;
  bonus_type?: string;
  month?: number;
  year?: number;
  [key: string]: unknown;
}

export function DriverBonuses() {
  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/drivers/bonuses.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as BonusRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<BonusRow>[] = [
    { key: "id", header: "ID" },
    { key: "bonus_type", header: "Type" },
    { key: "total_bonus", header: "Amount" },
    { key: "month", header: "Month" },
    { key: "year", header: "Year" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Bonuses</h2>
      <Card>
        <CardContent className="pt-4">
          <DataTable<BonusRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search…"
          />
        </CardContent>
      </Card>
    </div>
  );
}
