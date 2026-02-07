import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

const base = import.meta.env.VITE_API_BASE || "";

interface DrpRow {
  display_status: string;
  total_drivers: number;
  percentage: number;
  bar_class: string;
}

export function DrpScorePage() {
  const [data, setData] = useState<DrpRow[]>([]);
  const [monthYear, setMonthYear] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [year, month] = monthYear.split("-");
    fetch(`${base}/dashboard/monthly_drp_status_score?year=${year}&month=${month}`)
      .then((r) => r.json())
      .then((d) => (Array.isArray(d) ? setData(d) : setData([])))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [monthYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">DRP Score</h2>
      </div>

      <p className="text-sm text-slate-600">
        The <strong>DRP Score</strong> data is of month: <em>{new Date(monthYear + "-01").toLocaleString("default", { month: "long" })}</em> and year: <em>{monthYear.split("-")[0]}</em>
      </p>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h5 className="font-semibold">DRP Score Status</h5>
          <Input
            type="month"
            className="w-40"
            value={monthYear}
            onChange={(e) => setMonthYear(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Total drivers</TableHead>
                    <TableHead className="text-center">Total %</TableHead>
                    <TableHead className="w-[180px]">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row.display_status}>
                        <TableCell className="font-medium">{row.display_status}</TableCell>
                        <TableCell className="text-center">{row.total_drivers}</TableCell>
                        <TableCell className="text-center">{row.percentage}%</TableCell>
                        <TableCell>
                          <Progress value={row.percentage} className="h-2" />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
