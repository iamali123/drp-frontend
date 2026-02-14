import { useState, useEffect } from "react";
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
  Settings,
  Sliders,
  StickyNote,
  Menu,
  X,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { authStore } from "@/lib/authStore";
import { useOrganizationsList } from "@/apis/hooks/useOrganizations";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const navItems: (
  | { to: string; label: string; icon: React.ComponentType<{ className?: string }> }
  | {
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      children: { to: string; label: string }[];
    }
)[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/drp-score", label: "DRP Score", icon: TrendingUp },
  { to: "/admin/safety", label: "Safety", icon: Shield },
  { to: "/admin/bonus-reports", label: "Bonus Reports", icon: Wallet },
  { to: "/admin/contacts", label: "Contact Queries", icon: Mail },

  { to: "/admin/operations", label: "Operations", icon: Layers },
  { to: "/admin/score-settings", label: "Score Settings", icon: Sliders },
  { to: "/admin/score-notes", label: "Score Notes", icon: StickyNote },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/admin/driver-list", label: "Driver List", icon: Users },
  {
    label: "Leave Requests",
    icon: FileText,
    children: [
      { to: "/admin/leave-requests", label: "Leave Requests" },
      { to: "/admin/leave-limits", label: "Leave Limits" },
      { to: "/admin/block-leaves", label: "Block Leaves" },
    ],
  },
  { to: "/admin/organizations", label: "Organizations", icon: Building2 },
  { to: "/admin/departments", label: "Departments", icon: FolderTree },
  { to: "/admin/users", label: "Users", icon: UserCircle },
];

const LEAVE_PATHS = ["/admin/leave-requests", "/admin/leave-limits", "/admin/block-leaves"];

export function SafetyLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isLeaveActive = LEAVE_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/")
  );
  useEffect(() => {
    if (isLeaveActive) setLeaveOpen(true);
  }, [isLeaveActive]);
  const { data: organizations = [] } = useOrganizationsList({
    enabled: user?.role === "SuperAdmin",
  });
  const [selectedOrgId, setSelectedOrgId] = useState<string>(() => authStore.getOrganizationId() ?? "");

  useEffect(() => {
    setSelectedOrgId(authStore.getOrganizationId() ?? "");
  }, [user?.organizationId]);

  const isSuperAdmin = user?.role === "SuperAdmin";

  const handleOrganizationChange = (orgId: string) => {
    authStore.setOrganizationId(orgId);
    setSelectedOrgId(orgId);
    queryClient.invalidateQueries();
  };

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
          {navItems.map((item) =>
            "to" in item ? (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive && "active",
                    isActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )
                }
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 [.active_&]:bg-teal-100 [.active_&]:text-teal-700">
                  <item.icon className="h-4 w-4" />
                </span>
                {item.label}
              </NavLink>
            ) : (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setLeaveOpen((o) => !o)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isLeaveActive
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      isLeaveActive ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {leaveOpen ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </button>
                {leaveOpen && (
                  <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-200 pl-3">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-700"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          )
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          )}
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
          {navItems.map((item) =>
            "to" in item ? (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive ? "bg-teal-50 text-teal-700" : "text-slate-600"
                  )
                }
              >
                {item.label}
              </NavLink>
            ) : (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() => setLeaveOpen((o) => !o)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium",
                    isLeaveActive ? "bg-teal-50 text-teal-700" : "text-slate-600"
                  )}
                >
                  {item.label}
                  {leaveOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {leaveOpen &&
                  item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-lg py-2 pl-5 pr-3 text-sm font-medium",
                          isActive ? "bg-teal-50 text-teal-700" : "text-slate-600"
                        )
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
              </div>
            )
          )}
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
            {isSuperAdmin && organizations.length > 0 && (
              <Select
                value={selectedOrgId || undefined}
                onValueChange={handleOrganizationChange}
              >
                <SelectTrigger className="w-[220px] border-slate-200">
                  <Building2 className="mr-2 h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <span className="text-sm text-slate-500">{user?.email}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700 ring-offset-white transition-colors hover:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                  aria-label="Open account menu"
                >
                  <span className="text-sm font-medium">
                    {(user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/admin/settings" className="flex cursor-pointer items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
