"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Event {
  id: number;
  name: string;
  start_date: string;
  location: string;
  image_url?: string;
}

export function UpcomingEvents() {
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const response = await apiClient.get("/events/upcoming");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full lg:w-[350px] shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Event Calendar</h2>
          <p className="text-muted-foreground text-sm">
            Schedule, track, and manage all your events in one unified view.
          </p>
        </div>
      </div>

      <Card className="border-muted/40 shadow-sm overflow-hidden bg-muted/5">
        <CardHeader className="pb-3 border-b border-muted/40 bg-background/50">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Coming Soon
          </CardTitle>
          <CardDescription className="text-xs">Next {events.length} scheduled events.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center bg-background">
              <p className="text-sm text-muted-foreground italic">No upcoming events scheduled.</p>
              <Link href="/dashboard/event/create">
                <Button variant="link" size="sm" className="mt-2 text-xs">Create your first event</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-muted/40 bg-background">
              {events.map((event) => (
                <Link key={event.id} href={`/dashboard/event/view/${event.id}`}>
                  <div className="p-4 hover:bg-muted/30 transition-colors group relative overflow-hidden">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary/5 border border-primary/10 w-14 h-14 shrink-0 transition-transform group-hover:scale-105">
                        <span className="text-[10px] font-bold uppercase text-primary/70">
                          {format(new Date(event.start_date), "MMM")}
                        </span>
                        <span className="text-xl font-black text-primary leading-none">
                          {format(new Date(event.start_date), "dd")}
                        </span>
                      </div>
                      <div className="flex flex-col flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors pr-4">
                          {event.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{event.location || "Online"}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span>{format(new Date(event.start_date), "HH:mm")}</span>
                        </div>
                      </div>
                      <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
        <div className="p-3 border-t border-muted/40 text-center bg-muted/5">
          <Link href="/dashboard/event/event-list">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary">
              View All Events
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
