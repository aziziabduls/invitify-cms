"use client";

import * as React from "react";
import { Download, Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { apiClient } from "@/lib/api-client";

import { participantColumns } from "./columns";

export function ParticipantTable() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const table = useDataTableInstance({
    data,
    columns: participantColumns,
    defaultPageSize: 100,
    getRowId: (row) => row.id.toString(),
  });

  React.useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await apiClient.get("/participants");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
          <CardDescription>Manage your event participants.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search participants..."
                value={(table.getColumn("customer_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("customer_name")?.setFilterValue(event.target.value)
                }
                className="h-8 w-[150px] lg:w-[250px]"
              />
              <DataTableViewOptions table={table} />
              <Button variant="outline" size="sm">
                <Download />
                <span className="hidden lg:inline">Export</span>
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
                <DataTable table={table} columns={participantColumns} />
            )}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
