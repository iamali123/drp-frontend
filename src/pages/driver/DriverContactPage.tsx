import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const base = import.meta.env.VITE_API_BASE || "";

export function DriverContactPage() {
  const [message, setMessage] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch(`${base}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { message, reasons: reason ? [reason] : [] },
        }),
      });
      const data = await res.json();
      if (data?.success !== false) {
        setSuccess(true);
        setMessage("");
        setReason("");
      }
    } catch {
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-900">Contact</h2>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">Contact Safety Department</CardTitle>
          <p className="text-sm text-slate-500">
            Send a message or query to the safety team.
          </p>
        </CardHeader>
        <CardContent>
          {success && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Your request was sent successfully.
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Question about score"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="Your message…"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

