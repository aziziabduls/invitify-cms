"use client";

import * as React from "react";
import { Download, Loader, Plus } from "lucide-react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { apiClient } from "@/lib/api-client";

import { organizerColumns } from "./organizer-columns";

export function OrganizerTable() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const table = useDataTableInstance({
    data,
    columns: organizerColumns,
    defaultPageSize: 10,
    getRowId: (row) => row.id.toString(),
  });

  React.useEffect(() => {
    const fetchOrganizers = async () => {
      setLoading(true);
      try {
        const filterValue = table.getColumn("name")?.getFilterValue() as string;
        const queryParams = new URLSearchParams();
        if (filterValue) {
          queryParams.append("name", filterValue);
        }
        
        const response = await apiClient.get(`/organizers?${queryParams.toString()}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchOrganizers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [table.getColumn("name")?.getFilterValue()]);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Organizers</CardTitle>
          <CardDescription>Manage your event organizers.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search organizers..."
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/organizer/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                </Link>
              </Button>
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
                <DataTable table={table} columns={organizerColumns} />
            )}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
