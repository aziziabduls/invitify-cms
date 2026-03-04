"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader, Plus, Calendar as CalendarIcon, ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiClient } from "@/lib/api-client";
import { Organizer } from "../_components/schema";

export default function OrganizerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [organizer, setOrganizer] = React.useState<Organizer | null>(null);
  const [events, setEvents] = React.useState<any[]>([]);
  const [allEvents, setAllEvents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedEventId, setSelectedEventId] = React.useState<string>("");
  const [isAddingEvent, setIsAddingEvent] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
      const [orgRes, eventsRes, allEventsRes] = await Promise.all([
        apiClient.get(`/organizers/${id}`),
        apiClient.get(`/organizers/${id}/events`),
        apiClient.get("/events")
      ]);
      setOrganizer(orgRes.data);
      setEvents(eventsRes.data);
      setAllEvents(allEventsRes.data);
    } catch (error) {
      console.error("Error fetching organizer details:", error);
      // Fallback dummy data
      setOrganizer({
        id: Number(id),
        name: "Tech Events Inc",
        domain: "tech-events",
        scope: "International",
        category: "Technology",
        format: "hybrid",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setEvents([
        { id: 101, event: { name: "Flutter Jakarta 2025", status: "published" } },
        { id: 102, event: { name: "Next.js Conf", status: "draft" } }
      ]);
      setAllEvents([
        { event: { id: 101, name: "Flutter Jakarta 2025" } },
        { event: { id: 102, name: "Next.js Conf" } },
        { event: { id: 103, name: "React Summit" } }
      ]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddEvent = async () => {
    if (!selectedEventId) return;

    setIsAddingEvent(true);
    try {
      await apiClient.post(`/organizers/${id}/events`, { event_id: Number(selectedEventId) });
      toast.success("Event added to organizer successfully");
      fetchData();
      setSelectedEventId("");
    } catch (error) {
      console.error("Error adding event to organizer:", error);
      toast.error("Failed to add event to organizer");
    } finally {
      setIsAddingEvent(false);
    }
  };

  const handleRemoveEvent = async (eventId: number) => {
    if (!confirm("Are you sure you want to remove this event from the organizer?")) return;

    try {
      await apiClient.delete(`/organizers/${id}/events/${eventId}`);
      toast.success("Event removed from organizer successfully");
      fetchData();
    } catch (error) {
      console.error("Error removing event from organizer:", error);
      toast.error("Failed to remove event from organizer");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!organizer) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <h2 className="text-xl font-semibold">Organizer not found</h2>
        <Button onClick={() => router.push("/dashboard/organizer")}>
          Back to Organizers
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/default">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="/dashboard/organizer">Organizers</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Organizer Detail</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">{organizer.name}</h2>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">@{organizer.domain}</span>
                <span className="text-muted-foreground">•</span>
                <Badge variant="outline">{organizer.scope}</Badge>
                <Badge variant="outline">{organizer.category}</Badge>
                <Badge variant={organizer.format === "hybrid" ? "default" : "secondary"}>
                  {organizer.format}
                </Badge>
              </div>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Event to Organizer</DialogTitle>
                <DialogDescription>
                  Select an event to associate with this organizer.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an event" />
                  </SelectTrigger>
                  <SelectContent>
                    {allEvents.map((item) => (
                      <SelectItem key={item.event?.id || item.id} value={(item.event?.id || item.id)?.toString()}>
                        {item.event?.name || item.name || "Unknown Event"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedEventId("")}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent} disabled={!selectedEventId || isAddingEvent}>
                  {isAddingEvent && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Add to Organizer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Associated Events</CardTitle>
              <CardDescription>
                Events currently managed by this organizer.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <CalendarIcon className="mb-4 h-12 w-12 opacity-20" />
                  <p>No events associated yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {events.map((item) => (
                    <Card key={item.id} className="border-muted group">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <CalendarIcon className="h-5 w-5" />
                          </div>
                          <div className="flex flex-col">
                            <div className="font-medium">{item.event?.name || item.name || "Unknown Event"}</div>
                            { (item.event?.status || item.status) && (
                              <div className="mt-1">
                                <Badge variant="secondary" className="text-[10px] h-4 px-1 capitalize">
                                  {item.event?.status || item.status}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveEvent(item.event?.id || item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Scope</div>
                <div>{organizer.scope}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Category</div>
                <div>{organizer.category}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Format</div>
                <div className="capitalize">{organizer.format}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Created At</div>
                <div>{new Date(organizer.created_at).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
