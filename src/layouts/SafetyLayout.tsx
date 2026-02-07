import { useState } from "react";
import { Outlet, NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Shield,
  Wrench,
  Layers,
  Users,
  FileText,
  Wallet,
  UserCircle,
  Mail,
  Building2,
  FolderTree,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { FlashMessage } from "@/components/global/FlashMessage";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/drp-score", label: "DRP Score", icon: TrendingUp },
  { to: "/admin/safety", label: "Safety", icon: Shield },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/admin/operations", label: "Operations", icon: Layers },
  { to: "/admin/driver-list", label: "Driver List", icon: Users },
  { to: "/admin/leave-requests", label: "Leave Requests", icon: FileText },
  { to: "/admin/bonus-reports", label: "Bonus Reports", icon: Wallet },
  { to: "/admin/users", label: "Users", icon: UserCircle },
  { to: "/admin/contacts", label: "Contact Queries", icon: Mail },
  { to: "/admin/organizations", label: "Organizations", icon: Building2 },
  { to: "/admin/departments", label: "Departments", icon: FolderTree },
];

export function SafetyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const breadcrumb = location.pathname
    .replace("/admin/", "")
    .split("/")[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex xl:hidden h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-semibold text-slate-800">DRP Dashboard</span>
        <div className="w-9" />
      </nav>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 flex-col border-r border-slate-200 bg-white xl:flex">
        <div className="flex h-14 items-center border-b border-slate-100 px-4 shadow-sm">
          <img src="/drp-logo.png" alt="DRP" className="h-8 w-auto object-contain" />
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 [.active_&]:bg-teal-100 [.active_&]:text-teal-700">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <p className="font-medium text-slate-700">Leave requests</p>
            <p className="text-slate-500">
              <strong className="text-slate-900">—</strong>{" "}
              <span className="text-emerald-600">+0 today</span>
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-3 w-full justify-center gap-2"
            onClick={() => {}}
          >
            Upload monthly reports
          </Button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 xl:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 flex-col border-r border-slate-200 bg-white transition-transform xl:hidden",
          sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <img src="/drp-logo.png" alt="DRP" className="h-7 w-auto object-contain" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                  isActive ? "bg-teal-50 text-teal-700" : "text-slate-600"
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 xl:ml-64">
        <div className="pt-14 xl:pt-0">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 xl:px-8">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Pages</span>
              <span>/</span>
              <span className="font-medium text-slate-900">{breadcrumb}</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/change-password"
                className="text-sm text-teal-600 hover:text-teal-700 hover:underline"
              >
                Change password
              </Link>
              <span className="text-sm text-slate-500">{user?.email}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-slate-600"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>

          <div className="p-4 xl:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
