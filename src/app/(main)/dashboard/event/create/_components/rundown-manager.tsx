"use client"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFieldArray } from "react-hook-form"
import { CalendarIcon, Plus, Trash2, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useState, ChangeEvent } from "react"
import { UseFormReturn } from "react-hook-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"

interface RundownManagerProps {
    form: UseFormReturn<any>
}

export function RundownManager({ form }: RundownManagerProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "rundown",
    })

    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

    const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrls((prev) => ({ ...prev, [index]: url }))
            form.setValue(`rundown.${index}.image`, file, { shouldValidate: true })
        }
    }

    const openPreview = (url: string) => {
        setPreviewImage(url)
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium">Rundown</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() =>
                        append({
                            time: "",
                            date: new Date(),
                            title: "",
                            description: "",
                            image: null,
                        })
                    }
                >
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Item
                </Button>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="block lg:hidden space-y-3">
                {fields.map((field, index) => (
                    <Card key={field.id} className="relative">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        <CardContent className="pt-4 space-y-3">
                            {/* Date & Time Row */}
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name={`rundown.${index}.date`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-2 text-left font-normal text-xs h-9",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? format(field.value, "MMM d") : "Date"}
                                                            <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`rundown.${index}.time`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Time</FormLabel>
                                            <FormControl>
                                                <Input type="time" className="h-9 text-xs" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Title */}
                            <FormField
                                control={form.control}
                                name={`rundown.${index}.title`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Session title" className="text-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Description */}
                            <FormField
                                control={form.control}
                                name={`rundown.${index}.description`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Details..." className="min-h-[60px] text-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Image */}
                            <FormField
                                control={form.control}
                                name={`rundown.${index}.image`}
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Image</FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2 items-center">
                                                <Input
                                                    {...fieldProps}
                                                    type="file"
                                                    accept="image/*"
                                                    className="text-xs h-9"
                                                    onChange={(e) => handleImageChange(index, e)}
                                                />
                                                {previewUrls[index] && (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="icon"
                                                        className="shrink-0 h-9 w-9"
                                                        onClick={() => openPreview(previewUrls[index])}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>
                ))}
                {fields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm border rounded-lg">
                        No rundown items added.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-[900px]">
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[160px]">Date</TableHead>
                                <TableHead className="w-[100px]">Time</TableHead>
                                <TableHead className="w-[200px]">Image</TableHead>
                                <TableHead className="min-w-[180px]">Title</TableHead>
                                <TableHead className="min-w-[180px]">Description</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.map((field, index) => (
                                <TableRow key={field.id} className="group">
                                    {/* Date */}
                                    <TableCell className="align-top">
                                        <FormField
                                            control={form.control}
                                            name={`rundown.${index}.date`}
                                            render={({ field }) => (
                                                <FormItem className="flex flex-col">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <FormControl>
                                                                <Button
                                                                    variant={"outline"}
                                                                    className={cn(
                                                                        "w-full pl-3 text-left font-normal text-sm",
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
                                    </TableCell>

                                    {/* Time */}
                                    <TableCell className="align-top">
                                        <FormField
                                            control={form.control}
                                            name={`rundown.${index}.time`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input type="time" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>

                                    {/* Image */}
                                    <TableCell className="align-top">
                                        <FormField
                                            control={form.control}
                                            name={`rundown.${index}.image`}
                                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex gap-2 items-start">
                                                            <Input
                                                                {...fieldProps}
                                                                type="file"
                                                                accept="image/*"
                                                                className="text-xs"
                                                                onChange={(e) => handleImageChange(index, e)}
                                                            />
                                                            {previewUrls[index] && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="shrink-0"
                                                                    onClick={() => openPreview(previewUrls[index])}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>

                                    {/* Title */}
                                    <TableCell className="align-top">
                                        <FormField
                                            control={form.control}
                                            name={`rundown.${index}.title`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Opening Ceremony"
                                                            className="min-h-[40px] resize-y"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>

                                    {/* Description */}
                                    <TableCell className="align-top">
                                        <FormField
                                            control={form.control}
                                            name={`rundown.${index}.description`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea placeholder="Details about this session..." className="min-h-[40px]" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="align-top">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {fields.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No rundown items added.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
                <DialogContent className="sm:max-w-md">
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                        {previewImage && (
                            <Image src={previewImage} alt="Preview" fill className="object-contain" />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
