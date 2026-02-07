import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactECharts from "echarts-for-react";

const base = import.meta.env.VITE_API_BASE || "";
const periods = ["month", "quarter", "halfYear", "year"] as const;

export function AnalyticsPage() {
  const [drpStatusData, setDrpStatusData] = useState<{ categories: string[]; series: { name: string; data: number[] }[] } | null>(null);
  const [driverScoreData, setDriverScoreData] = useState<{ categories: string[]; series: { name: string; data: number[] }[] } | null>(null);
  const [driverPositionData, setDriverPositionData] = useState<{ name: string; value: number }[]>([]);
  const [driverBonusData, setDriverBonusData] = useState<{ categories: string[]; series: { name: string; data: number[] }[]; total_amount_spent?: number } | null>(null);
  const [period, setPeriod] = useState(periods[0]);
  const [value, setValue] = useState(String(new Date().getMonth() + 1));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    Promise.all([
      fetch(`${base}/update_drp_status_chart?period=month&value=${month}`).then((r) => r.json()).catch(() => null),
      fetch(`${base}/update_driver_score_chart?period=month&value=${month}`).then((r) => r.json()).catch(() => null),
      fetch(`${base}/update_driver_position_chart?period=month&value=${month}`).then((r) => r.json()).catch(() => []),
      fetch(`${base}/update_driver_bonus_chart?period=month&value=${month}`).then((r) => r.json()).catch(() => null),
    ])
      .then(([drp, score, position, bonus]) => {
        if (drp?.categories) setDrpStatusData(drp);
        if (score?.categories) setDriverScoreData(score);
        if (Array.isArray(position)) setDriverPositionData(position.map((p: { name: string; data: number[] }) => ({ name: p.name, value: p.data?.reduce((a: number, b: number) => a + b, 0) ?? 0 })));
        if (bonus?.categories) setDriverBonusData(bonus);
      })
      .finally(() => setLoading(false));
  }, []);

  const drpOption = drpStatusData
    ? {
        grid: { left: 48, right: 24, top: 24, bottom: 48 },
        xAxis: { type: "category" as const, data: drpStatusData.categories },
        yAxis: { type: "value" as const, name: "Count" },
        series: drpStatusData.series?.map((s: { name: string; data: number[] }) => ({ type: "bar" as const, name: s.name, data: s.data })) ?? [],
      }
    : null;

  const scoreOption = driverScoreData
    ? {
        grid: { left: 48, right: 24, top: 24, bottom: 48 },
        xAxis: { type: "category" as const, data: driverScoreData.categories },
        yAxis: { type: "value" as const, name: "Count" },
        series: driverScoreData.series?.map((s: { name: string; data: number[] }) => ({ type: "bar" as const, name: s.name, data: s.data })) ?? [],
      }
    : null;

  const positionOption = driverPositionData.length
    ? {
        tooltip: { trigger: "item" as const },
        series: [{ type: "pie" as const, radius: "60%", data: driverPositionData }],
      }
    : null;

  const bonusOption = driverBonusData
    ? {
        grid: { left: 48, right: 24, top: 24, bottom: 48 },
        xAxis: { type: "category" as const, data: driverBonusData.categories },
        yAxis: { type: "value" as const, name: "Amount" },
        series: driverBonusData.series?.map((s: { name: string; data: number[] }) => ({ type: "bar" as const, name: s.name, data: s.data })) ?? [],
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
        <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
        <Button variant="outline" size="sm" asChild>
          <a href={`${base}/export_statistics_data?format=xlsx`} target="_blank" rel="noreferrer">
            Export All Data
          </a>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <strong>DRP Status</strong>
            <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {drpOption && <ReactECharts option={drpOption} style={{ height: 280 }} opts={{ renderer: "canvas" }} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <strong>Driver Score</strong>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {new Date(2000, m - 1).toLocaleString("default", { month: "short" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {scoreOption && <ReactECharts option={scoreOption} style={{ height: 280 }} opts={{ renderer: "canvas" }} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <strong>Driver Position</strong>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {new Date(2000, m - 1).toLocaleString("default", { month: "short" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {positionOption && <ReactECharts option={positionOption} style={{ height: 280 }} opts={{ renderer: "canvas" }} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <strong>Bonuses</strong>
            <Select value={value} onValueChange={setValue}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {new Date(2000, m - 1).toLocaleString("default", { month: "short" })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {driverBonusData?.total_amount_spent != null && (
              <p className="mb-2 text-sm text-slate-600">
                Total Amount Spent: <strong>${driverBonusData.total_amount_spent.toLocaleString()}</strong>
              </p>
            )}
            {bonusOption && <ReactECharts option={bonusOption} style={{ height: 260 }} opts={{ renderer: "canvas" }} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
