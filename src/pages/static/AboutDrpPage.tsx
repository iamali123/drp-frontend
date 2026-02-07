import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Info } from "lucide-react";

export function AboutDrpPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <Info className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">
          What is the Driver Retention Program?
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Mission</h2>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 leading-relaxed">
              Driver Retention Program (DRP): Our DRP is designed to recognize and reward the hard work and dedication of our truck drivers, and to encourage their long-term retention with our company. Through this program, we provide resources and support to help you succeed in your role and build a fulfilling career with us.
            </p>
          </CardContent>
        </Card>
        <div className="flex items-center justify-center rounded-xl bg-slate-100 p-8">
          <div className="h-48 w-full max-w-sm rounded-lg bg-slate-200/80 text-center text-slate-500 flex items-center justify-center">
            [Image placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}
