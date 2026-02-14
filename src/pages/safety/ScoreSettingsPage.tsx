import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlashMessage } from "@/components/global/FlashMessage";
import {
  useScoreSettingsList,
  useUpdateScoreSettings,
} from "@/apis/hooks/useScoreSettings";
import type { ScoreSettings, ScoreRange } from "@/apis/types/scoreSettings";
import { Settings, Save } from "lucide-react";

export function ScoreSettingsPage() {
  const [flash, setFlash] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingSettings, setEditingSettings] = useState<ScoreSettings | null>(null);
  const [operations, setOperations] = useState<ScoreRange>({ minimum: 0, maximum: 10, base: 5 });
  const [maintenance, setMaintenance] = useState<ScoreRange>({ minimum: 0, maximum: 10, base: 5 });

  const { data: settingsList = [], isLoading, isError, error } = useScoreSettingsList();
  const updateMutation = useUpdateScoreSettings({
    onSuccess: () => {
      setEditingSettings(null);
      setFlash({ type: "success", message: "Score settings updated successfully." });
    },
    onError: (e) => setFlash({ type: "error", message: e.message }),
  });

  useEffect(() => {
    if (settingsList.length > 0 && !editingSettings) {
      const current = settingsList[0];
      setOperations(current.operations);
      setMaintenance(current.maintenance);
    }
  }, [settingsList, editingSettings]);

  const handleEdit = (s: ScoreSettings) => {
    setEditingSettings(s);
    setOperations(s.operations);
    setMaintenance(s.maintenance);
  };

  const handleCancel = () => {
    setEditingSettings(null);
    if (settingsList.length > 0) {
      setOperations(settingsList[0].operations);
      setMaintenance(settingsList[0].maintenance);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSettings) return;
    updateMutation.mutate({
      id: editingSettings.id,
      payload: {
        id: editingSettings.id,
        operations,
        maintenance,
      },
    });
  };

  const currentSettings = settingsList[0] || null;
  const isEditing = editingSettings !== null;

  return (
    <div className="space-y-6">
      <FlashMessage
        type={flash?.type}
        message={flash?.message ?? ""}
        onDismiss={() => setFlash(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="score-settings-header">
          Score Settings
        </h2>
        {currentSettings && !isEditing && (
          <Button onClick={() => handleEdit(currentSettings)} className="gap-2">
            <Settings className="h-4 w-4" />
            Edit settings
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Settings className="h-5 w-5" />
            <span className="font-medium">Organization score settings</span>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
            </div>
          )}
          {isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error?.message ?? "Failed to load score settings."}
            </div>
          )}
          {!isLoading && !isError && !currentSettings && (
            <p className="py-8 text-center text-slate-500">
              No score settings found for your organization.
            </p>
          )}
          {!isLoading && !isError && currentSettings && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-medium text-slate-900">Operations</h3>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="ops-minimum">Minimum</Label>
                      <Input
                        id="ops-minimum"
                        type="number"
                        min={0}
                        max={100}
                        value={operations.minimum}
                        onChange={(e) =>
                          setOperations({ ...operations, minimum: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ops-maximum">Maximum</Label>
                      <Input
                        id="ops-maximum"
                        type="number"
                        min={0}
                        max={100}
                        value={operations.maximum}
                        onChange={(e) =>
                          setOperations({ ...operations, maximum: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="ops-base">Base</Label>
                      <Input
                        id="ops-base"
                        type="number"
                        min={0}
                        max={100}
                        value={operations.base}
                        onChange={(e) =>
                          setOperations({ ...operations, base: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-medium text-slate-900">Maintenance</h3>
                  <div className="grid gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="maint-minimum">Minimum</Label>
                      <Input
                        id="maint-minimum"
                        type="number"
                        min={0}
                        max={100}
                        value={maintenance.minimum}
                        onChange={(e) =>
                          setMaintenance({ ...maintenance, minimum: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maint-maximum">Maximum</Label>
                      <Input
                        id="maint-maximum"
                        type="number"
                        min={0}
                        max={100}
                        value={maintenance.maximum}
                        onChange={(e) =>
                          setMaintenance({ ...maintenance, maximum: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maint-base">Base</Label>
                      <Input
                        id="maint-base"
                        type="number"
                        min={0}
                        max={100}
                        value={maintenance.base}
                        onChange={(e) =>
                          setMaintenance({ ...maintenance, base: Number(e.target.value) })
                        }
                        disabled={!isEditing}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2">
                  <Button type="submit" disabled={updateMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" />
                    {updateMutation.isPending ? "Saving…" : "Save changes"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
