const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function api<T>(
  path: string,
  options?: RequestInit & { params?: Record<string, string> }
): Promise<T> {
  const { params, ...init } = options ?? {};
  const url = new URL(path.startsWith("http") ? path : `${API_BASE}${path}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error || "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const apiRoutes = {
  login: "/api/users/sign_in",
  logout: "/api/users/sign_out",
  adminDashboard: "/admin_dashboard",
  yearlyDriver: "/dashboard/yearly_driver",
  monthlyDrpStatusScore: "/dashboard/monthly_drp_status_score",
  monthlyTopDriverScore: "/dashboard/monthly_top_driver_score",
  driverBonusData: "/dashboard/driver_bonus_data",
  overallStatistics: "/overall_statistics",
  updateDriverPositionChart: "/update_driver_position_chart",
  updateDriverBonusChart: "/update_driver_bonus_chart",
  updateDrpStatusChart: "/update_drp_status_chart",
  updateDriverScoreChart: "/update_driver_score_chart",
  exportStatisticsData: "/export_statistics_data",
  safetyDepartments: "/safety_departments",
  drpStatusAndScore: "/safety_departments/drp_status_and_score",
  driverList: "/safety_departments/driver_list",
  showDriver: "/safety_departments/show_driver",
  joyrideSafetyScores: "/joyride_safety_scores",
  maintainanceScores: "/maintainance_scores",
  operationScores: "/operation_scores",
  bonusStructures: "/bonus_structures",
  leaveRequests: "/leave_requests",
  contacts: "/contacts",
  departmentTypes: "/department_types",
} as const;
