import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const leftItems = [
  "Delivery/pick-up times / Load Rejections / Completions",
  "Miles / Trips completed * *(Additional $0.70 for every mile driven over 2800 miles per week) *(Does not apply to Local position)",
  "Fuel efficiency",
  "Safety records",
];

const rightItems = [
  "Customer/Operations/Maintenance satisfaction",
  "Compliance with regulations",
  "Equipment maintenance",
  "Communication Skills",
];

export function FaqPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 py-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <HelpCircle className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">FAQ</h1>
      </div>

      <h2 className="text-center text-xl font-semibold text-slate-800">
        What do we measure
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-4">
          {leftItems.map((text, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                  —
                </div>
                <p className="text-sm text-slate-600">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex items-center justify-center">
          <div className="h-64 w-full max-w-xs rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
            [Truck image]
          </div>
        </div>
        <div className="space-y-4">
          {rightItems.map((text, i) => (
            <Card key={i}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-xs">
                  —
                </div>
                <p className="text-sm text-slate-600">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
