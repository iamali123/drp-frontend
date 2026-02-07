import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    if (user.isSafetyDepartment) navigate("/admin/dashboard", { replace: true });
    else navigate("/driver/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      const stored = localStorage.getItem("drp_user");
      const u = stored ? JSON.parse(stored) : null;
      if (u?.isSafetyDepartment) navigate("/admin/dashboard", { replace: true });
      else navigate("/driver/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex justify-center">
            <img src="/drp-logo.png" alt="Driver Retention Program" className="h-16 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Driver Retention Program
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Login to your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-900" disabled={loading}>
              {loading ? "Signing in…" : "Continue"}
            </Button>
          </form>
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-xs text-slate-600">
            <p className="font-medium text-slate-700">Demo login (no API)</p>
            <p className="mt-1">Admin: <code className="rounded bg-slate-200 px-1">admin@demo.com</code> / <code className="rounded bg-slate-200 px-1">demo123</code></p>
            <p className="mt-0.5">Driver: <code className="rounded bg-slate-200 px-1">driver@demo.com</code> / <code className="rounded bg-slate-200 px-1">demo123</code></p>
          </div>
          <p className="mt-4 text-center text-sm text-slate-500">
            Orior Media · DRP Dashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
