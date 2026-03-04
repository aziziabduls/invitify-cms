"use client";

import { Edit, MoreHorizontal, Trash, Ban } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiClient } from "@/lib/api-client";

interface EventTableActionsProps {
  event: any;
}

export function EventTableActions({ event }: EventTableActionsProps) {
  const router = useRouter();

  const handleSetInactive = async () => {
    try {
      await apiClient.patch(`/events/${event.id}/status`, { status: "inactive" });
      toast.success("Event set as inactive");
      // router.refresh();
      // window.location.reload();
      window.location.href = "/dashboard/event/event-list";
    } catch (error) {
      toast.error("Failed to update event status");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/events/${event.id}`);
      toast.success("Event deleted successfully");
      // router.refresh();
      window.location.href = "/dashboard/event/event-list";
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(event.id.toString())}
        >
          Copy event ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/event/edit/${event.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSetInactive}>
          <Ban className="mr-2 h-4 w-4" />
          Set as Inactive
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
