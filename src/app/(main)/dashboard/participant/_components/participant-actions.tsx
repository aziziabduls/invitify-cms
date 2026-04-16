"use client";

import { MoreHorizontal, Trash, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Participant } from "./schema";

interface ParticipantActionsProps {
  participant: Participant;
}

export function ParticipantActions({ participant }: ParticipantActionsProps) {
  const handleAction = async (action: "set_as_paid" | "block" | "remove") => {
    const path = `/participants/${participant.event_id}/${participant.id}/${action}`;
    try {
      await apiClient.post(path);
      const msg =
        action === "set_as_paid"
          ? "Participant set as paid"
          : action === "block"
          ? "Participant blocked"
          : "Participant removed";
      toast.success(msg);
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error ||
        error?.message ||
        "Action failed. Please try again.";
      toast.error(errMsg);
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
        {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(participant.id.toString())}>
          Copy ID
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction("set_as_paid")}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Set as Paid
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction("block")}>
          <Ban className="mr-2 h-4 w-4" />
          Block
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => handleAction("remove")}
        >
          <Trash className="mr-2 h-4 w-4" />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
