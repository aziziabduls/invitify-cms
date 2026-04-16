"use client";

import * as React from "react";
import { Loader, QrCode, Search, CheckCircle2, AlertCircle, Camera, Keyboard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { attendanceColumns } from "./columns";
import { Attendance } from "./schema";
import { Html5QrcodeScanner } from "html5-qrcode";

export function AttendanceTable() {
  const [data, setData] = React.useState<Attendance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [scanValue, setScanValue] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("scanner");

  const table = useDataTableInstance({
    data,
    columns: attendanceColumns,
    defaultPageSize: 100,
    getRowId: (row) => row.id.toString(),
  });

  const fetchAttendance = React.useCallback(async () => {
    try {
      const response = await apiClient.get("/participants/attendance");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      toast.error("Failed to fetch attendance data");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const processCheckIn = async (value: string) => {
    if (!value.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      let payload: any;
      try {
        payload = JSON.parse(value);
        if (!payload.type || payload.type !== 'attendance_check') {
          payload = { 
            participantId: value, 
            type: 'attendance_check',
            eventId: null
          };
        }
      } catch {
        payload = { 
          participantId: value, 
          type: 'attendance_check',
          eventId: null
        };
      }

      const response = await apiClient.post(`/participants/check-in`, payload);

      if (response.status === 200 || response.status === 201) {
        toast.success(`Check-in successful for ${response.data.customer_name || "participant"}`);
        setScanValue("");
        fetchAttendance();
      }
    } catch (error: any) {
      console.error("Check-in error:", error);
      const message = error.response?.data?.message || "Check-in failed. Please check participant status.";
      toast.error(message);
      setScanValue(""); // Clear input on error to allow next scan
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    await processCheckIn(scanValue);
  };

  React.useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;

    if (activeTab === "webcam") {
      scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        async (decodedText) => {
          if (scanner) {
            scanner.clear();
          }
          setActiveTab("scanner"); // Switch back to see result
          await processCheckIn(decodedText);
        },
        (error) => {
          // ignore scan errors
        }
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      }
    };
  }, [activeTab]);

  return (
    <div className="grid grid-cols-1 gap-6 *:data-[slot=card]:shadow-xs">
      {/* Scanner Input Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            Attendance Input
          </CardTitle>
          <CardDescription>Choose between physical scanner/manual input or webcam scanning.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 lg:w-[400px]">
              <TabsTrigger value="scanner" className="flex items-center gap-2">
                <Keyboard className="h-4 w-4" />
                Scanner / Manual
              </TabsTrigger>
              <TabsTrigger value="webcam" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Webcam
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
              <form onSubmit={handleScan} className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Scan QR or Enter Participant ID/Email..."
                    value={scanValue}
                    onChange={(e) => setScanValue(e.target.value)}
                    className={cn(
                      "h-12 pl-10 text-lg ring-primary/20 focus-visible:ring-primary",
                      scanValue && "text-transparent select-none caret-transparent"
                    )}
                    autoFocus
                    disabled={isProcessing}
                  />
                  {scanValue && (
                    <div className="absolute left-10 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none text-muted-foreground animate-pulse">
                      <span className="font-medium">Scanning......</span>
                    </div>
                  )}
                </div>
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isProcessing || !scanValue.trim()}
                  className="px-8 font-bold"
                >
                  {isProcessing ? "Processing..." : "Check In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="webcam" className="flex flex-col items-center">
              <div id="reader" className="w-full max-w-[500px] overflow-hidden rounded-lg border bg-background shadow-inner"></div>
              <p className="mt-4 text-sm text-muted-foreground">
                Position the QR code within the frame to scan automatically.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Attendance List Card */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance List</CardTitle>
          <CardDescription>View and manage participant attendance status.</CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search by name"
                value={(table.getColumn("customer_name")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("customer_name")?.setFilterValue(event.target.value)
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
                <div className="flex h-48 items-center justify-center">
                    <Loader className="animate-spin text-primary" />
                </div>
            ) : (
                <DataTable table={table} columns={attendanceColumns} />
            )}
          </div>
          <DataTablePagination table={table} />
        </CardContent>
      </Card>
    </div>
  );
}
