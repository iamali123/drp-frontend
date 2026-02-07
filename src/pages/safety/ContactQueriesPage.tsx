import { Card, CardContent } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/global/DataTable";

const base = import.meta.env.VITE_API_BASE || "";

interface ContactRow {
  id: number;
  message?: string;
  reasons?: string[];
  created_at?: string;
  user_email?: string;
  [key: string]: unknown;
}

export function ContactQueriesPage() {
  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/contacts.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as ContactRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<ContactRow>[] = [
    { key: "id", header: "ID" },
    { key: "user_email", header: "Email" },
    { key: "message", header: "Message" },
    {
      key: "reasons",
      header: "Reasons",
      render: (row) =>
        Array.isArray(row.reasons) ? row.reasons.join(", ") : String(row.reasons ?? "—"),
    },
    { key: "created_at", header: "Date" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">Contact Queries</h2>
      </div>

      <Card>
        <CardContent className="pt-4">
          <DataTable<ContactRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search here…"
          />
        </CardContent>
      </Card>
    </div>
  );
}
