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
import { Badge } from "@/components/ui/badge";
import { driversService } from "@/apis/services/drivers";
import type { Driver } from "@/apis/types/drivers";
import { Users, MoreHorizontal, Eye, Pencil } from "lucide-react";

export function DriverListPage() {
  const fetchData = async (params: {
    page: number;
    perPage: number;
    search?: string;
  }) => {
    const res = await driversService.listPagination({
      pageIndex: params.page,
      pageSize: params.perPage,
    });
    let drivers = res.data || [];
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      drivers = drivers.filter(
        (d) =>
          d.username.toLowerCase().includes(searchLower) ||
          d.phone.toLowerCase().includes(searchLower) ||
          d.licenseNumber.toLowerCase().includes(searchLower) ||
          d.licenseState.toLowerCase().includes(searchLower)
      );
    }
    return { data: drivers, total: res.totalCount || drivers.length };
  };

  const columns: Column<Driver>[] = [
    { key: "username", header: "Username" },
    { key: "phone", header: "Phone" },
    { key: "licenseNumber", header: "License #" },
    { key: "licenseState", header: "License State" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge
          variant={row.status === "active" ? "outline" : "secondary"}
          className={row.status === "active" ? "text-emerald-600" : ""}
        >
          {row.status}
        </Badge>
      ),
    },
    { key: "driverType", header: "Type" },
    { key: "timezone", header: "Timezone" },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-slate-900" id="driver-list-header">
          Drivers
        </h2>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 pb-3 text-slate-600">
            <Users className="h-5 w-5" />
            <span className="font-medium">Organization drivers</span>
          </div>
          <DataTable<Driver>
            columns={columns}
            fetchData={fetchData}
            searchPlaceholder="Search by username, phone, license…"
          />
        </CardContent>
      </Card>
    </div>
  );
}
