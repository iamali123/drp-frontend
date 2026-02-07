import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type Column } from "@/components/global/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const base = import.meta.env.VITE_API_BASE || "";

interface UserRow {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_number?: string;
  department_type?: string;
  [key: string]: unknown;
}

export function DriverListPage() {
  const [searchParams] = useSearchParams();
  const departmentType = searchParams.get("department_type") ?? "";
  const departmentName = searchParams.get("department_name") ?? "All";

  const fetchData = async (params: { page: number; perPage: number; search?: string }) => {
    const q = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
      department_type: departmentType,
    });
    if (params.search) q.set("search", params.search);
    const res = await fetch(`${base}/safety_departments.json?${q}`);
    const data = await res.json();
    const rows = Array.isArray(data) ? data : data?.data ?? [];
    return { data: rows as UserRow[], total: data?.total ?? rows.length };
  };

  const columns: Column<UserRow>[] = [
    { key: "first_name", header: "First Name" },
    { key: "last_name", header: "Last Name" },
    { key: "email", header: "Email" },
    { key: "mobile_number", header: "Mobile Number" },
    { key: "department_type", header: "Category" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <a href={`${base}/safety_departments/show_driver?driver_id=${row.id}`}>View</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`${base}/safety_departments/edit_driver?driver_id=${row.id}`}>Edit</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900">
          {departmentName} - Users
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm">Department Filters</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <a href="?department_name=All">All</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="?department_type=1&department_name=Safety">Safety</a>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href="?department_type=2&department_name=Operations">Operations</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardContent className="pt-4">
          <DataTable<UserRow>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search here…"
            extraParams={{ department_type: departmentType }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
