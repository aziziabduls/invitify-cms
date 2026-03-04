"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Upload, MapPin } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbLink,
} from "@/components/ui/breadcrumb"
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { RundownManager } from "../../create/_components/rundown-manager"
import { BrandManager } from "../../create/_components/brand-manager"
import { PromoCodeManager } from "../../create/_components/promo-code-manager"
import { MoneyInput } from "../../create/_components/money-input"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"


const eventFormSchema = z.object({
    name: z.string().min(2, {
        message: "Event name must be at least 2 characters.",
    }),
    tagline: z.string().optional(),
    logo: z.any().optional(),
    image: z.any().optional(),
    startDate: z.date({
        required_error: "Start date is required.",
    }),
    endDate: z.date({
        required_error: "End date is required.",
    }),
    timezone: z.string().min(1, {
        message: "Timezone is required.",
    }),
    location: z.string().min(1, {
        message: "Location is required.",
    }),
    locationUrl: z.string().optional(),
    isFree: z.boolean().default(false),
    price: z.number().min(0).optional(),
    currency: z.string().optional(),
    maxParticipants: z.number().min(0).optional(),
    rundown: z.array(z.object({
        time: z.string().min(1, "Time is required"),
        date: z.date(),
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        image: z.any().optional()
    })).optional(),
    brands: z.array(z.object({
        name: z.string().min(1, "Brand name is required"),
        icon: z.any().optional(),
    })).optional(),
    promoCodes: z.array(z.object({
        code: z.string().min(1, "Code is required"),
        type: z.enum(["percentage", "fixed"]),
        value: z.number().min(0),
        limit: z.number().min(0).optional(),
    })).optional(),
    isSharedAlbumEnabled: z.boolean().default(false),
    about: z.string().optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

export default function EditEventPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const form = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: {
            name: "",
            tagline: "",
            location: "",
            locationUrl: "",
            timezone: "UTC",
            isFree: false,
            price: 0,
            currency: "USD",
            maxParticipants: 0,
            rundown: [],
            brands: [],
            promoCodes: [],
            isSharedAlbumEnabled: false,
            about: "",
        },
    })

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            if (!id) return;
            try {
                const response = await apiClient.get(`/events/${id}`);
                const data = response.data.event; // Nested event object
                const rundowns = response.data.rundowns || [];
                const brands = response.data.brands || [];
                const promoCodes = response.data.promo_codes || [];

                // Map API response to form values
                const formValues: any = {
                    name: data.name,
                    tagline: data.tagline || "",
                    location: data.location,
                    locationUrl: data.location_url || "",
                    timezone: data.timezone,
                    isFree: data.is_free,
                    price: Number(data.price) || 0,
                    currency: data.currency,
                    maxParticipants: data.max_participants || 0,
                    isSharedAlbumEnabled: data.is_shared_album_enabled,
                    about: data.about || "",
                    startDate: data.start_date ? new Date(data.start_date) : undefined,
                    endDate: data.end_date ? new Date(data.end_date) : undefined,
                    rundown: rundowns.map((item: any) => ({
                        ...item,
                        time: item.rundown_time,
                        date: item.rundown_date ? new Date(item.rundown_date) : new Date(),
                    })),
                    brands: brands.map((item: any) => ({
                        name: item.name,
                        icon: item.icon_url,
                    })),
                    promoCodes: promoCodes.map((item: any) => ({
                        code: item.code,
                        type: item.type,
                        value: Number(item.value),
                        limit: item.usage_limit,
                    })),
                };

                form.reset(formValues);
            } catch (error) {
                console.error("Error fetching event:", error);
                toast.error("Failed to load event data");
                // router.push("/dashboard/event/event-list");
            } finally {
                setIsFetching(false);
            }
        };

        fetchEvent();
    }, [id, form]);
    

    async function onSubmit(data: EventFormValues) {
        // console.log("You submitted the following values:", data)

        // Transform data to match API expectation
        const payload = {
            ...data,
            // Ensure nested arrays are included and formatted if necessary
            rundown: data.rundown?.map(item => ({
                ...item,
                // Ensure date is ISO string if needed, or keep as is
                date: item.date instanceof Date ? item.date.toISOString() : item.date
            })),
            brands: data.brands,
            promoCodes: data.promoCodes
        };

        // Handle form submission (e.g., API call)
        try {
            setIsLoading(true);
            const response = await apiClient.put(`/events/${id}`, payload);
            console.log(response.data);
            toast.success("Event updated successfully!",{
                duration: 3000
            });
            // redirect to dashboard
            router.push("/dashboard/event/event-list");
        } catch (error) {
            console.error("Error updating event:", error);
            toast.error("Error updating event. Please try again. " + error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isFetching) {
        return <div className="flex h-full items-center justify-center">Loading event data...</div>;
    }

    return (
        <div className="flex flex-1 flex-col gap-4">
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
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-4 w-full">
                <div className="space-y-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Edit Event</h1>
                        <p className="text-muted-foreground text-xs sm:text-sm">
                            Update the details of your event below.
                        </p>
                    </div>
                    <div className="grid gap-2 rounded-xl border bg-card text-card-foreground shadow-sm p-4 sm:p-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                    {/* Name */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Event Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Tech Conference 2025" className="text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Tagline */}
                                    <FormField
                                        control={form.control}
                                        name="tagline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Tagline</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Innovate together" className="text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                    {/* Start Date */}
                                    <FormField
                                        control={form.control}
                                        name="startDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs sm:text-sm">Start Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* End Date */}
                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel className="text-xs sm:text-sm">End Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full pl-3 text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Timezone */}
                                    <FormField
                                        control={form.control}
                                        name="timezone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Timezone</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select timezone" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="UTC">UTC</SelectItem>
                                                        <SelectItem value="GMT">GMT</SelectItem>
                                                        <SelectItem value="EST">EST</SelectItem>
                                                        <SelectItem value="PST">PST</SelectItem>
                                                        <SelectItem value="IST">IST</SelectItem>
                                                        <SelectItem value="CET">CET</SelectItem>
                                                        <SelectItem value="Asia/Jakarta">Asia/Jakarta</SelectItem>
                                                        <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                    {/* Location */}
                                    <FormField
                                        control={form.control}
                                        name="location"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Location Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jakarta Convention Center" className="text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Location URL */}
                                    <FormField
                                        control={form.control}
                                        name="locationUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Location URL</FormLabel>
                                                <div className="flex gap-2">
                                                    <FormControl>
                                                        <Input placeholder="https://maps.google.com/..." className="text-sm" {...field} />
                                                    </FormControl>
                                                    <Button type="button" variant="outline" size="icon" title="Select from Map">
                                                        <MapPin className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                    {/* Price Section */}
                                    <div className="space-y-3">
                                        <FormField
                                            control={form.control}
                                            name="isFree"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel className="text-sm">Free Event</FormLabel>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        {!form.watch("isFree") && (
                                            <div className="flex gap-2">
                                                <FormField
                                                    control={form.control}
                                                    name="currency"
                                                    render={({ field }) => (
                                                        <FormItem className="w-[100px]">
                                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="USD" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="USD">USD</SelectItem>
                                                                    <SelectItem value="IDR">IDR</SelectItem>
                                                                    <SelectItem value="EUR">EUR</SelectItem>
                                                                    <SelectItem value="SGD">SGD</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="price"
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <MoneyInput 
                                                                    placeholder="0.00" 
                                                                    value={field.value}
                                                                    onChange={field.onChange}
                                                                    onBlur={field.onBlur}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Max Participants */}
                                    <FormField
                                        control={form.control}
                                        name="maxParticipants"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Max Participants</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        placeholder="0 (Unlimited)" 
                                                        className="text-sm" 
                                                        {...field} 
                                                        value={field.value === 0 ? "" : field.value}
                                                        onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Leave 0 for unlimited participants.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                                    {/* Logo Upload */}
                                    <FormField
                                        control={form.control}
                                        name="logo"
                                        render={({ field: { value, onChange, ...fieldProps } }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Event Logo</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="logo-upload"
                                                            className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                                        >
                                                            <div className="flex flex-col items-center justify-center py-3 sm:pt-5 sm:pb-6 text-muted-foreground">
                                                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4" />
                                                                <p className="text-xs sm:text-sm mb-1 sm:mb-2 text-center px-2"><span className="font-semibold">Click to upload</span> logo</p>
                                                            </div>
                                                            <Input
                                                                {...fieldProps}
                                                                id="logo-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(event) => {
                                                                    onChange(event.target.files && event.target.files[0]);
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs sm:text-sm">SVG, PNG, JPG or GIF (MAX. 800x400px).</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Image Upload */}
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({ field: { value, onChange, ...fieldProps } }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs sm:text-sm">Event Image</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center justify-center w-full">
                                                        <label
                                                            htmlFor="image-upload"
                                                            className="flex flex-col items-center justify-center w-full h-24 sm:h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                                        >
                                                            <div className="flex flex-col items-center justify-center py-3 sm:pt-5 sm:pb-6 text-muted-foreground">
                                                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-4" />
                                                                <p className="text-xs sm:text-sm mb-1 sm:mb-2 text-center px-2"><span className="font-semibold">Click to upload</span> banner</p>
                                                            </div>
                                                            <Input
                                                                {...fieldProps}
                                                                id="image-upload"
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(event) => {
                                                                    onChange(event.target.files && event.target.files[0]);
                                                                }}
                                                            />
                                                        </label>
                                                    </div>
                                                </FormControl>
                                                <FormDescription className="text-xs sm:text-sm">Main event banner or cover image.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* About */}
                                <FormField
                                    control={form.control}
                                    name="about"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs sm:text-sm">About Event</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us a little bit about the event"
                                                    className="resize-y min-h-[80px] sm:min-h-[100px] text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs sm:text-sm">
                                                A brief description of the event.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                

                                <div className="col-span-2">
                                    <PromoCodeManager form={form} />
                                </div>

                                <div className="col-span-2">
                                    <BrandManager form={form} />
                                </div>

                                <div className="col-span-2">
                                    <RundownManager form={form} />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="isSharedAlbumEnabled"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Shared Album</FormLabel>
                                                    <FormDescription>
                                                        Enable shared photo/video album for attendees.
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-4">
                                    <Button variant="outline" type="button" className="w-full sm:w-auto" onClick={() => router.back()}>Cancel</Button>
                                    <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
                                        {isLoading ? "Updating..." : "Update Event"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}
