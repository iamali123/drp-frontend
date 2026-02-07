import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SafetyLayout } from "@/layouts/SafetyLayout";
import { DriverLayout } from "@/layouts/DriverLayout";
import { AdminDashboard } from "@/pages/safety/AdminDashboard";
import { AnalyticsPage } from "@/pages/safety/AnalyticsPage";
import { DrpScorePage } from "@/pages/safety/DrpScorePage";
import { SafetyScorePage } from "@/pages/safety/SafetyScorePage";
import { MaintenanceScorePage } from "@/pages/safety/MaintenanceScorePage";
import { OperationScorePage } from "@/pages/safety/OperationScorePage";
import { DriverListPage } from "@/pages/safety/DriverListPage";
import { LeaveRequestsPage } from "@/pages/leave/LeaveRequestsPage";
import { BonusReportsPage } from "@/pages/safety/BonusReportsPage";
import { UsersPage } from "@/pages/safety/UsersPage";
import { ContactQueriesPage } from "@/pages/safety/ContactQueriesPage";
import { OrganizationsPage } from "@/pages/safety/OrganizationsPage";
import { DriverDashboard } from "@/pages/driver/DriverDashboard";
import { DriverAnalytics } from "@/pages/driver/DriverAnalytics";
import { DriverBonuses } from "@/pages/driver/DriverBonuses";
import { DriverLeaveRequests } from "@/pages/driver/DriverLeaveRequests";
import { DriverContactPage } from "@/pages/driver/DriverContactPage";
import { DriverProfilePage } from "@/pages/driver/DriverProfilePage";
import { AboutDrpPage } from "@/pages/static/AboutDrpPage";
import { FaqPage } from "@/pages/static/FaqPage";
import { RulesPage } from "@/pages/static/RulesPage";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode;
  role: "safety" | "driver";
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role === "safety" && !user.isSafetyDepartment)
    return <Navigate to="/driver/dashboard" replace />;
  if (role === "driver" && !user.isDriver)
    return <Navigate to="/admin/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/about_drp" element={<AboutDrpPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/rules_and_regulation" element={<RulesPage />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="safety">
            <SafetyLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="drp-score" element={<DrpScorePage />} />
        <Route path="safety" element={<SafetyScorePage />} />
        <Route path="maintenance" element={<MaintenanceScorePage />} />
        <Route path="operations" element={<OperationScorePage />} />
        <Route path="driver-list" element={<DriverListPage />} />
        <Route path="leave-requests" element={<LeaveRequestsPage />} />
        <Route path="bonus-reports" element={<BonusReportsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="contacts" element={<ContactQueriesPage />} />
        <Route path="organizations" element={<OrganizationsPage />} />
      </Route>

      <Route
        path="/driver/*"
        element={
          <ProtectedRoute role="driver">
            <DriverLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DriverDashboard />} />
        <Route path="analytics" element={<DriverAnalytics />} />
        <Route path="bonuses" element={<DriverBonuses />} />
        <Route path="leave-requests" element={<DriverLeaveRequests />} />
        <Route path="contact" element={<DriverContactPage />} />
        <Route path="profile" element={<DriverProfilePage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
