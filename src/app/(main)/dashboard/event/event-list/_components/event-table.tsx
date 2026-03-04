"use client";

import { Download, Loader, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useRouter } from "next/navigation";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { apiClient } from "@/lib/api-client";

import { recentLeadsColumns } from "./columns.config";
import { toast } from "sonner";
import axios from "axios";

export function TableEventList() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const hasFetched = useRef(false);

    const table = useDataTableInstance({
        data,
        columns: recentLeadsColumns,
        getRowId: (row) => row?.id?.toString(),
    });

    const getStatus = (startDate: string, endDate: string) => {
        const now = new Date().getTime();
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        // If current time is before start time, it's upcoming
        if (now < start) return "Upcoming";
        
        // If current time is after end time, it's past
        if (now > end) return "Inactive";
        
        // Otherwise, it's currently happening (between start and end)
        return "Ongoing";
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/auth/v2/login");
            return;
        }

        if (hasFetched.current) return;
        hasFetched.current = true;

        loadEvents();
    }, [router]);
    
    const loadEvents = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get("/events");
            if(response.status !== 200) {
                toast.error("Failed to load events");
                return;
            }
            const transformedData = response.data.map((item: any) => {
                const event = item.event;
                const updatedAt = event.updated_at ? new Date(event.updated_at) : new Date();
                const isValidDate = !isNaN(updatedAt.getTime());

                return {
                    id: event.id,
                    name: event.name,
                    status: getStatus(event.start_date, event.end_date),
                    participant: event.max_participants,
                    lastActivity: isValidDate ? formatDistanceToNow(updatedAt, { addSuffix: true }) : "N/A",
                };
            });
            setData(transformedData);
        } catch (err) {
            // console.error(err);
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    toast.error("Session expired. Please log in again.", { duration: 3000, onAutoClose: () => {
                        localStorage.removeItem("token");
                        router.push("/auth/v2/login");
                    } });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
            <Card>
                <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                    <CardDescription>Track and manage your latest events and their status.</CardDescription>
                    <CardAction>
                        <div className="flex items-center gap-2">
                            {loading && (
                                <Button variant="outline" size="sm" disabled>
                                    <Loader className="animate-spin" />
                                    <span className="hidden lg:inline">Loading</span>
                                </Button>
                            )}
                            {/* add reload button */}
                            <Button variant="outline" size="sm" onClick={() => loadEvents()}>
                                <RefreshCcw />
                                <span className="hidden lg:inline">Reload</span>
                            </Button>
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
                        <DataTable table={table} columns={recentLeadsColumns} />
                    </div>
                    <DataTablePagination table={table} />
                </CardContent>
            </Card>
        </div>
    );
}
