"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Users, DollarSign, Edit, Trash, Ban, ArrowLeft, Currency, CurrencyIcon, LucideCurrency, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { apiClient } from "@/lib/api-client";
import { formatCurrency } from "@/lib/utils";

export default function ViewEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const hasFetched = useRef(false);


  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/events/${id}`);
        setEvent(response.data);
        hasFetched.current = true;
        // toast.success("Event details loaded successfully", {
        //     // duration: Infinity,
        //     description: (
        //         <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
        //         <code className="text-white">{JSON.stringify(response.data, null, 2)}</code>
        //         </pre>
        //     ),
        // });
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
        router.push("/dashboard/event/event-list");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, router]);

  const handleSetInactive = async () => {
    try {
      await apiClient.patch(`/events/${id}/status`, { status: "inactive" });
      toast.success("Event set as inactive");
      // Refresh data
      const response = await apiClient.get(`/events/${id}`);
      setEvent(response.data);
    } catch (error) {
      toast.error("Failed to update event status");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmation !== "delete") {
        toast.error("Please type 'delete' to confirm.");
        return;
    }

    try {
      await apiClient.delete(`/events/${id}`);
      toast.success("Event deleted successfully");
      router.push("/dashboard/event/event-list");
    } catch (error) {
      toast.error("Failed to delete event");
      console.error(error);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading event details...</div>;
  }

  if (!event) {
    return <div className="flex h-full items-center justify-center">Event not found</div>;
  }

  const { event: eventData, rundowns, brands, promo_codes } = event;

  return (
    <div className="flex flex-col gap-6">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard/default">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard/event/event-list">Event</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>View</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{eventData.name}</h1>
          <p className="text-muted-foreground">{eventData.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push(`/dashboard/event/edit/${id}`)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
            {eventData.status !== "inactive" && (
                <Button variant="outline" onClick={handleSetInactive}>
                    <Ban className="mr-2 h-4 w-4" />
                    Set Inactive
                </Button>
            )}
            
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the event
                            and remove all associated data.
                            <br /><br />
                            Type <strong>delete</strong> to confirm.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-2">
                        <Input 
                            value={deleteConfirmation} 
                            onChange={(e) => setDeleteConfirmation(e.target.value)}
                            placeholder="Type 'delete' to confirm"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteConfirmation("")}>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={(e) => {
                                e.preventDefault();
                                handleDelete();
                            }}
                            disabled={deleteConfirmation !== "delete"}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete Event
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Date & Time</p>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(eventData.start_date), "PPP p")} - <br />
                                    {format(new Date(eventData.end_date), "PPP p")}
                                </p>
                                <Badge variant="outline" className="mt-1">{eventData.timezone}</Badge>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Location</p>
                                <p className="text-sm text-muted-foreground">{eventData.location}</p>
                                {eventData.location_url && (
                                    <a 
                                        href={eventData.location_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                    >
                                        View Map
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <Wallet className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Price</p>
                                <p className="text-sm text-muted-foreground">
                                    {eventData.is_free ? "Free" : formatCurrency(Number(eventData.price), { currency: eventData.currency }) }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="font-medium">Participants</p>
                                <p className="text-sm text-muted-foreground">
                                    Max: {eventData.max_participants === 0 ? "Unlimited" : eventData.max_participants}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <p className="font-medium mb-2">About</p>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{eventData.about || "No description provided."}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Rundown */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Rundown
                    </CardTitle>
                    <CardDescription>Event schedule and agenda</CardDescription>
                </CardHeader>
                <CardContent>
                    {rundowns.length > 0 ? (
                        <div className="space-y-4">
                            {rundowns.map((item: any) => (
                                <div key={item.id} className="flex gap-4 border-l-2 border-primary pl-4 pb-4 last:pb-0">
                                    <div className="min-w-[80px]">
                                        <p className="font-bold text-sm">{item.rundown_time}</p>
                                        <p className="text-xs text-muted-foreground">{format(new Date(item.rundown_date), "MMM d")}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No rundown available.</p>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Status</span>
                            <Badge variant={eventData.status === "active" ? "default" : "secondary"}>
                                {eventData.status}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Shared Album</span>
                            <Badge variant={eventData.is_shared_album_enabled ? "outline" : "secondary"}>
                                {eventData.is_shared_album_enabled ? "Enabled" : "Disabled"}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Brands / Sponsors</CardTitle>
                </CardHeader>
                <CardContent>
                    {brands.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {brands.map((brand: any) => (
                                <Badge key={brand.id} variant="secondary">
                                    {brand.name}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No brands listed.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Promo Codes</CardTitle>
                </CardHeader>
                <CardContent>
                    {promo_codes.length > 0 ? (
                        <div className="space-y-2">
                            {promo_codes.map((code: any) => (
                                <div key={code.id} className="flex justify-between items-center text-sm border p-2 rounded-md">
                                    <div className="font-mono font-bold">{code.code}</div>
                                    <div className="text-muted-foreground">
                                        {code.type === "percentage" ? `${code.value}%` : formatCurrency(Number(code.value), eventData.currency)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No promo codes.</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
