"use client";

import * as React from "react";
import { Loader } from "lucide-react";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { apiClient } from "@/lib/api-client";

import { columns } from "./columns";
import { UserRole } from "./schema";

export function UserRoleTable() {
  const [data, setData] = React.useState<UserRole[]>([]);
  const [roles, setRoles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/users");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await apiClient.get("/admin/roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const table = useDataTableInstance({
    data,
    columns,
    defaultPageSize: 10,
    getRowId: (row) => row.id.toString(),
    meta: {
      roles,
      refreshData: fetchUsers,
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>User Management List</CardTitle>
          <CardDescription>You can manage users and their roles here.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search users..."
                value={(table.getColumn("full_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("full_name")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <DataTableViewOptions table={table} />
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex size-full flex-col gap-4">
          <div className="overflow-hidden rounded-md border">
            {loading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader className="animate-spin" />
              </div>
            ) : (
              <DataTable table={table} columns={columns} />
            )}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
