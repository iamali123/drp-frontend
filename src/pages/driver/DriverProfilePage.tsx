import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Label } from "@/components/ui/label";

export function DriverProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
      <Card className="max-w-md">
        <CardHeader className="flex flex-row items-center gap-4">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt=""
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-100 text-2xl font-semibold text-teal-700">
              {(user?.firstName?.[0] ?? user?.email?.[0] ?? "?").toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-900">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : "Driver"}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-slate-500">Email</Label>
            <p className="font-medium">{user?.email ?? "—"}</p>
          </div>
          <div>
            <Label className="text-slate-500">Driver ID</Label>
            <p className="font-medium">{user?.driverId ?? "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
