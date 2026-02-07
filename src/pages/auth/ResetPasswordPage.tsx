import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useResetPassword } from "@/apis/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const { mutate: submit, isPending, error, reset } = useResetPassword({
    onSuccess: () => setSuccess(true),
    onError: () => reset(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    submit({
      email: email.trim(),
      token: token.trim(),
      newPassword,
    });
  };

  const valid = email && token;
  const match = newPassword === confirmPassword;

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6">
            <p className="text-center text-slate-600">
              Invalid or missing reset link. Please request a new one from the{" "}
              <Link to="/forgot-password" className="text-teal-600 hover:underline">
                forgot password
              </Link>{" "}
              page.
            </p>
            <Button asChild className="mt-4 w-full">
              <Link to="/forgot-password">Request new link</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex justify-center">
            <img src="/drp-logo.png" alt="DRP" className="h-16 w-auto object-contain" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Reset password</h1>
          <p className="text-sm text-slate-600">Enter your new password below.</p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Your password has been reset. You can now sign in.
              </div>
              <Button asChild className="w-full">
                <Link to="/login">Sign in</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                  {error.message}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                {confirmPassword && !match && (
                  <p className="text-xs text-red-600">Passwords do not match.</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isPending || !newPassword || !match}
              >
                {isPending ? "Resetting…" : "Reset password"}
              </Button>
              <p className="text-center text-sm text-slate-500">
                <Link to="/login" className="text-teal-600 hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
