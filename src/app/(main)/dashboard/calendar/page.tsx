import { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CalendarView } from "./_components/calendar-view";
import { UpcomingEvents } from "./_components/upcoming-events";

export const metadata: Metadata = {
  title: "Event Calendar | Invitify",
  description: "Manage your events in a calendar view.",
};

export default function CalendarPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/default">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Calendar</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">


        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <UpcomingEvents />
          <CalendarView />
        </div>
      </div>
    </div>
  );
}
