import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AttendanceTable } from "./_components/attendance-table";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance | Invitify",
  description: "Scan participant QR codes to track attendance and show e-tickets.",
};

export default function AttendancePage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/default">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Attendance</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Booth Attendance</h2>
            <p className="text-muted-foreground text-sm">
              Scan participant QR codes to track attendance and show e-tickets.
            </p>
          </div>
        </div>
        <AttendanceTable />
      </div>
    </div>
  );
}
