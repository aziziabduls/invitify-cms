"use client";

import * as React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ExternalLink,
  MoreVertical
} from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  eachDayOfInterval,
  isToday
} from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Event {
  id: number;
  name: string;
  start_date: string;
  tagline?: string;
  logo_url?: string;
}

export function CalendarView() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [events, setEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchCalendarEvents = React.useCallback(async () => {
    try {
      setLoading(true);
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const response = await apiClient.get(`/events/calendar?month=${month}&year=${year}`);
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  React.useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(new Date(event.start_date), day));
  };

  return (
    <Card className="flex-1 shadow-sm border-muted/40 bg-background">
      <CardHeader className="flex flex-row items-center justify-between pb-4 ">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">
            {format(currentDate, "MMMM yyyy")}
          </CardTitle>
          <CardDescription>View and manage events by date.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="h-8 text-xs">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Link href="/dashboard/event/create">
            <Button size="sm" className="ml-2 h-8">
              <Plus className="mr-2 h-4 w-4" />
              New Event
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-7 border-t border-muted/40 bg-muted/50 text-center font-medium text-xs py-2 tracking-tight text-muted-foreground">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-t border-muted/40">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isSelectedMonth = isSameMonth(day, monthStart);

            return (
              <div
                key={day.toString()}
                className={cn(
                  "min-h-[140px] border-b border-r border-muted/40 p-2 transition-colors hover:bg-muted/5",
                  !isSelectedMonth && "bg-muted/20 text-muted-foreground/50",
                  isSelectedMonth && "bg-background",
                  idx % 7 === 6 && "border-r-0"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday(day) ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"
                  )}>
                    {format(day, "d")}
                  </span>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href="/dashboard/event/create">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100 lg:opacity-30 hover:opacity-100 hover:bg-primary/10">
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">New Event on {format(day, "MMM d")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[100px] scrollbar-hide">
                  {dayEvents.map(event => (
                    <Link key={event.id} href={`/dashboard/event/view/${event.id}`}>
                      <div className="group relative flex items-center gap-1.5 rounded-md bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 border border-primary/10 transition-all duration-200 truncate">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="truncate">{event.name}</span>
                        <ExternalLink className="ml-auto h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
