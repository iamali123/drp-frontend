import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, BarChart3, Wallet, FileText, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/driver/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/driver/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/driver/bonuses", label: "Bonuses", icon: Wallet },
  { to: "/driver/leave-requests", label: "Leave Request", icon: FileText },
  { to: "/driver/contact", label: "Contact", icon: User },
];

export function DriverLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logout();
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-700 bg-slate-800 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-slate-700 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img src="/drp-logo.png" alt="DRP" className="h-8 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-2">
          <NavLink
            to="/driver/profile"
            className="flex items-center gap-2 rounded-full p-1 hover:bg-slate-700"
          >
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-sm font-medium">
                {(user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
              </div>
            )}
          </NavLink>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-56 flex-col border-r border-slate-700 bg-slate-800 text-white transition-transform md:flex",
          sidebarOpen ? "flex translate-x-0" : "hidden -translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-700 px-4 md:justify-center">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            className="text-white md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </nav>
      </aside>

      <main className="md:ml-56">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
