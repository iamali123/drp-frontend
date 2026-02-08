import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { KeyRound, Mail, User, Building2, Shield } from "lucide-react";

export function SettingsPage() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const changePasswordTo = isAdmin ? "/admin/change-password" : "/driver/change-password";

  if (!user) return null;

  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";
  const roleLabel = user.isSafetyDepartment ? "Safety / Admin" : user.isDriver ? "Driver" : "—";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
        <p className="text-sm text-slate-600">Your account and security.</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="h-5 w-5" />
            <span className="font-medium">Profile</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Mail className="h-4 w-4 shrink-0" />
              <span>Email</span>
            </div>
            <p className="pl-6 text-slate-900">{user.email}</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <User className="h-4 w-4 shrink-0" />
              <span>Name</span>
            </div>
            <p className="pl-6 text-slate-900">{displayName}</p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Shield className="h-4 w-4 shrink-0" />
              <span>Role</span>
            </div>
            <p className="pl-6 text-slate-900">{roleLabel}</p>
          </div>
          {user.organizationId && (
            <div className="grid gap-2">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Building2 className="h-4 w-4 shrink-0" />
                <span>Organization ID</span>
              </div>
              <p className="pl-6 font-mono text-sm text-slate-900">{user.organizationId}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-slate-700">
            <KeyRound className="h-5 w-5" />
            <span className="font-medium">Security</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-600">
            Change your password regularly to keep your account secure.
          </p>
          <Button asChild>
            <Link to={changePasswordTo}>Change password</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
