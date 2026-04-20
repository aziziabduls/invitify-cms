import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { OrganizerTable } from "./_components/organizer-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizers | Invitify",
  description: "Manage and view all event organizers.",
};

export default function OrganizerPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/default">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Organizers</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Organizers</h2>
            <p className="text-muted-foreground text-sm">
              View and manage all organizers.
            </p>
          </div>
        </div>
        <OrganizerTable />
      </div>
    </div>
  );
}
