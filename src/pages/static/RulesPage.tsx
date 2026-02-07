import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function RulesPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-700">
          <FileText className="h-5 w-5" />
        </span>
        <h1 className="text-2xl font-semibold text-slate-900">
          Rules & Regulations
        </h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-xl bg-slate-100 p-8 flex items-center justify-center min-h-[200px]">
          <span className="text-slate-500 text-sm">[Image placeholder]</span>
        </div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">
              How do you increase your benefits and position at Joyride Logistics LLC?
            </h2>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Build a Strong Work Record:</strong>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Establish a reputation as a reliable and dependable truck driver by consistently meeting or exceeding performance expectations.</li>
                  <li>Be punctual, follow company policies and procedures, and maintain a safe driving record.</li>
                  <li>Aim to build a positive track record that reflects your commitment and professionalism.</li>
                  <li>Volunteer for additional responsibilities that contribute to the company&apos;s success and showcase your capabilities.</li>
                  <li>Stay updated on industry trends, regulations, and technologies through continuous learning and professional development.</li>
                  <li>Foster a collaborative and cooperative work environment by being a team player and actively contributing to the team&apos;s success.</li>
                </ul>
              </li>
              <li>
                <strong>Be Proactive in Seeking Feedback:</strong>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Request regular feedback from the management on your performance and areas for improvement.</li>
                  <li>Actively work on addressing any feedback received and continuously strive to improve your skills and performance.</li>
                </ul>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
