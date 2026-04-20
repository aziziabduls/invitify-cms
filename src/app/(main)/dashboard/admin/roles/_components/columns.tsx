"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UserRole } from "./schema";

export const columns: ColumnDef<UserRole>[] = [

  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col w-[350px]">
          <span className="font-medium text-foreground">{row.getValue("full_name")}</span>
          <span className="text-muted-foreground text-xs">{row.original.email}</span>
        </div>
      )
    }
  },

  {
    accessorKey: "total_organizer",
    header: "Organizers",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("total_organizer") || 0}</div>;
    },
  },
  {
    accessorKey: "total_event",
    header: "Events",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.getValue("total_event") || 0}</div>;
    },
  },
  {
    accessorKey: "last_login_at",
    header: "Last Login",
    cell: ({ row }) => {
      const date = row.getValue("last_login_at");
      if (!date) return <span className="text-muted-foreground italic text-xs">Never</span>;
      return <span className="text-xs">{format(new Date(date as string), "MMM d, yyyy HH:mm")}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Joined At",
    cell: ({ row }) => {
      const date = row.getValue("created_at");
      if (!date) return null;
      return <span className="text-xs">{format(new Date(date as string), "MMM d, yyyy")}</span>;
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row, table }) => {
      const role = row.getValue("role") as string;
      const userId = row.original.id;
      // Access roles from table meta
      const roles = (table.options.meta as any)?.roles || [];

      const handleRoleChange = async (newRole: string) => {
        try {
          await apiClient.patch(`/admin/users/${userId}/role`, { role_name: newRole });
          toast.success(`Role updated to ${newRole} for ${row.original.full_name}`);
          // Trigger refresh via meta callback if provided
          (table.options.meta as any)?.refreshData?.();
        } catch (error) {
          console.error("Error updating role:", error);
          toast.error("Failed to update user role");
        }
      };

      return (
        <Select defaultValue={role} onValueChange={handleRoleChange}>
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((r: any) => (
              <SelectItem key={r.id} value={r.name}>
                {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row, table }) => {
      const isActive = row.getValue("is_active") as boolean;
      const userId = row.original.id;

      const handleStatusToggle = async (checked: boolean) => {
        try {
          await apiClient.patch(`/admin/users/${userId}/status`, { is_active: checked });
          toast.success(`User ${checked ? 'activated' : 'deactivated'} successfully`);
          (table.options.meta as any)?.refreshData?.();
        } catch (error) {
          console.error("Error updating status:", error);
          toast.error("Failed to update user status");
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Switch
            checked={isActive}
            onCheckedChange={handleStatusToggle}
            aria-label="Toggle user status"
          />
          {/* <span className="text-xs text-muted-foreground w-12 italic">
            {isActive ? 'Active' : 'Inactive'}
          </span> */}
        </div>
      );
    }
  }
];
