import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReactECharts from "echarts-for-react";

const base = import.meta.env.VITE_API_BASE || "";

export function DriverAnalytics() {
  const [data, setData] = useState<{ labels?: string[]; data?: number[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base}/drivers/analytics`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const option = data?.labels?.length
    ? {
        grid: { left: 48, right: 24, top: 24, bottom: 48 },
        xAxis: { type: "category" as const, data: data.labels },
        yAxis: { type: "value" as const },
        series: [{ type: "bar" as const, data: data.data ?? [], itemStyle: { color: "#0d9488" } }],
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
      <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
      <Card>
        <CardHeader>
          <h5 className="font-semibold">Driver Analytics</h5>
        </CardHeader>
        <CardContent>
          {option ? (
            <ReactECharts option={option} style={{ height: 320 }} opts={{ renderer: "canvas" }} />
          ) : (
            <p className="py-8 text-center text-slate-500">No analytics data available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
