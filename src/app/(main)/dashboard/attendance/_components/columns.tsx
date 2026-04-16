"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Attendance } from "./schema";
import { format } from "date-fns";

export const attendanceColumns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row }) => <div className="w-[40px]">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.getValue("customer_name")}
        </div>
      );
    },
  },
  {
    accessorKey: "customer_email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue("customer_email")}</div>,
  },
  {
    accessorKey: "event_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Event Name" />
    ),
    cell: ({ row }) => <div>{row.getValue("event_name")}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Attendance Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const attendedAt = row.original.attended_at;

      if (status === "attended") {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              <CheckCircle2 className="mr-1 h-3 w-3" />
              Attended
            </Badge>
            {attendedAt && (
              <span className="text-muted-foreground text-xs">
                {format(new Date(attendedAt), "dd MMM yyyy HH:mm ")}
              </span>
            )}
          </div>
        );
      }

      return (
        <Badge variant="secondary">
          <Circle className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      );
    },
  },
];
