import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import ReactECharts from "echarts-for-react";
import { apiRoutes } from "@/lib/api";

interface AvgScore {
  safety_score?: number;
  maintenance_score?: number;
  operations_score?: number;
  score_differences?: Record<string, number>;
}

interface DrpStatusRow {
  display_status: string;
  total_drivers: number;
  percentage: number;
  bar_class: string;
}

interface DriverCountData {
  labels: string[];
  data: number[];
  total?: number;
  local?: number;
  regional?: number;
  count_change_html?: string;
}

interface TopPerformer {
  driver_id: number;
  full_name: string;
  drp_status: string;
  profile_image_url?: string;
}

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1;
const currentYear = currentDate.getFullYear();

export function AdminDashboard() {
  const [avgScores, setAvgScores] = useState<AvgScore | null>(null);
  const [drpStatus, setDrpStatus] = useState<DrpStatusRow[]>([]);
  const [driverChart, setDriverChart] = useState<DriverCountData | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [driverBonusTotal, setDriverBonusTotal] = useState<string>("$0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = import.meta.env.VITE_API_BASE || "";
    Promise.all([
      fetch(`${base}${apiRoutes.adminDashboard}`).then((r) => r.json()).catch(() => null),
      fetch(
        `${base}/dashboard/monthly_drp_status_score?year=${currentYear}&month=${currentMonth}`
      ).then((r) => r.json()).catch(() => []),
      fetch(`${base}/dashboard/yearly_driver?year=${currentYear}`).then((r) => r.json()).catch(() => null),
      fetch(
        `${base}/dashboard/monthly_top_driver_score?year=${currentYear}&month=${currentMonth}`
      ).then((r) => r.json()).catch(() => []),
      fetch(
        `${base}/dashboard/driver_bonus_data?year=${currentYear}&month=${currentMonth}`
      ).then((r) => r.json()).catch(() => ({ total_bonus: 0 })),
    ])
      .then(([dashboard, drp, drivers, top, bonus]) => {
        if (dashboard?.average_scores) setAvgScores(dashboard.average_scores);
        if (Array.isArray(drp)) setDrpStatus(drp);
        if (drivers?.labels) setDriverChart({ labels: drivers.labels, data: drivers.data, ...drivers.driver_count_data });
        if (Array.isArray(top)) setTopPerformers(top);
        if (bonus?.total_bonus != null) setDriverBonusTotal(`$${Number(bonus.total_bonus).toLocaleString()}`);
      })
      .finally(() => setLoading(false));
  }, []);

  const scoreCards = [
    { label: "Safety", key: "safety_score" as const, value: avgScores?.safety_score ?? 0, diff: avgScores?.score_differences?.safety_score ?? 0 },
    { label: "Maintenance", key: "maintenance_score" as const, value: avgScores?.maintenance_score ?? 0, diff: avgScores?.score_differences?.maintenance_score ?? 0 },
    { label: "Operations", key: "operations_score" as const, value: avgScores?.operations_score ?? 0, diff: avgScores?.score_differences?.operations_score ?? 0 },
  ];

  const driverChartOption = driverChart
    ? {
        grid: { left: 40, right: 20, top: 20, bottom: 40 },
        xAxis: { type: "category" as const, data: driverChart.labels },
        yAxis: { type: "value" as const, name: "Driver Count" },
        series: [{ type: "bar" as const, data: driverChart.data, itemStyle: { color: "#0d9488" } }],
      }
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Safety Score</h2>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/safety">Manage Safety</Link>
        </Button>
      </div>

      {/* Average score cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {scoreCards.map(({ label, value, diff }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm text-slate-500">Average {label} Score</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {value}/10
                  <span className="ml-2 text-sm font-normal text-slate-500">
                    <span className={diff >= 0 ? "text-emerald-600" : "text-red-600"}>
                      {diff >= 0 ? `+${diff}` : diff}
                    </span>{" "}
                    month
                  </span>
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <span className="text-lg font-medium">—</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drivers chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h5 className="font-semibold">Drivers</h5>
            <div className="flex items-center gap-2">
              <select className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm">
                {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <Button asChild size="sm">
                <Link to="/admin/driver-list">See All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {driverChartOption && (
              <ReactECharts option={driverChartOption} style={{ height: 270 }} opts={{ renderer: "canvas" }} />
            )}
            <div className="mt-4 text-center text-sm text-slate-600">
              Total Driver: <strong className="text-slate-900">{driverChart?.total ?? "—"}</strong>
            </div>
          </CardContent>
        </Card>

        {/* DRP Score Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h5 className="font-semibold">DRP Score Status</h5>
            <div className="flex items-center gap-2">
              <input
                type="month"
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                defaultValue={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
              />
              <Button asChild size="sm">
                <Link to="/admin/drp-score">See All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Total drivers</TableHead>
                    <TableHead className="text-center">Total %</TableHead>
                    <TableHead className="w-[140px]">Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {drpStatus.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-slate-500">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    drpStatus.map((row) => (
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top performers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h6 className="font-semibold">Top performing drivers</h6>
            <input
              type="month"
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              defaultValue={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
            />
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-slate-500">
              {topPerformers.length} Elite drivers this month
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver Name</TableHead>
                  <TableHead>Driver ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-slate-500">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  topPerformers.slice(0, 5).map((d) => (
                    <TableRow key={d.driver_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {d.profile_image_url ? (
                            <img
                              src={d.profile_image_url}
                              alt=""
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
                              {d.full_name?.[0] ?? "?"}
                            </div>
                          )}
                          {d.full_name}
                        </div>
                      </TableCell>
                      <TableCell>{d.driver_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{d.drp_status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/admin/driver-list?driver_id=${d.driver_id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Driver Bonus card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h5 className="font-semibold">Driver Bonus</h5>
            <div className="flex items-center gap-2">
              <input
                type="month"
                className="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                defaultValue={`${currentYear}-${String(currentMonth).padStart(2, "0")}`}
              />
              <Button asChild size="sm">
                <Link to="/admin/bonus-reports">See All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-700">Driver Bonus</p>
              <p className="text-xs text-slate-500">Total Amount Spent</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{driverBonusTotal}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
