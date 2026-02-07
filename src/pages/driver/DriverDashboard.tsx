import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ReactECharts from "echarts-for-react";
import { useAuth } from "@/lib/auth";

const base = import.meta.env.VITE_API_BASE || "";

export function DriverDashboard() {
  const { user } = useAuth();
  const [drpStatus, setDrpStatus] = useState<{ display_status: string; total_drivers: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${base}/drivers/drp_status_and_score`)
      .then((r) => r.json())
      .then((d) => setDrpStatus(Array.isArray(d?.drp_status) ? d.drp_status : []))
      .catch(() => setDrpStatus([]))
      .finally(() => setLoading(false));
  }, []);

  const chartOption = drpStatus.length
    ? {
        grid: { left: 48, right: 24, top: 24, bottom: 48 },
        xAxis: {
          type: "category" as const,
          data: drpStatus.map((s) => s.display_status),
        },
        yAxis: { type: "value" as const },
        series: [
          {
            type: "bar" as const,
            data: drpStatus.map((s) => s.total_drivers),
            itemStyle: { color: "#0d9488" },
          },
        ],
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
      <div className="rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user?.firstName ?? user?.email}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <h5 className="font-semibold">DRP Status & Score</h5>
          </CardHeader>
          <CardContent>
            {chartOption && (
              <ReactECharts option={chartOption} style={{ height: 260 }} opts={{ renderer: "canvas" }} />
            )}
            <Button asChild size="sm" className="mt-4">
              <Link to="/driver/analytics">See Analytics</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <h5 className="font-semibold">Quick Links</h5>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/driver/leave-requests">Leave Request</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/driver/bonuses">Bonuses</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/driver/contact">Contact Safety</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
