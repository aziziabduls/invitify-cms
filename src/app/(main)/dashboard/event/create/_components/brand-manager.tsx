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
import { useFieldArray, UseFormReturn } from "react-hook-form"
import { Plus, Trash2, Eye, Upload } from "lucide-react"
import { useState, ChangeEvent } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface BrandManagerProps {
    form: UseFormReturn<any>
}

export function BrandManager({ form }: BrandManagerProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "brands",
    })

    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})

    const handleImageChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrls((prev) => ({ ...prev, [index]: url }))
            form.setValue(`brands.${index}.icon`, file, { shouldValidate: true })
        }
    }

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium">Brands / Sponsors</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() =>
                        append({
                            name: "",
                            icon: null,
                        })
                    }
                >
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Brand
                </Button>
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="block md:hidden space-y-3">
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
                            {/* Brand Name */}
                            <FormField
                                control={form.control}
                                name={`brands.${index}.name`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Brand Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Brand Name" className="text-sm" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Icon Upload */}
                            <FormField
                                control={form.control}
                                name={`brands.${index}.icon`}
                                render={({ field: { value, onChange, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Icon</FormLabel>
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
                                                    <div className="h-9 w-9 relative rounded border overflow-hidden shrink-0">
                                                        <img src={previewUrls[index]} alt="Preview" className="object-cover w-full h-full" />
                                                    </div>
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
                        No brands added.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[300px]">Brand Icon</TableHead>
                            <TableHead>Brand Name</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                {/* Icon */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`brands.${index}.icon`}
                                        render={({ field: { value, onChange, ...fieldProps } }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="flex gap-2 items-center">
                                                        <Input
                                                            {...fieldProps}
                                                            type="file"
                                                            accept="image/*"
                                                            className="text-sm cursor-pointer"
                                                            onChange={(e) => handleImageChange(index, e)}
                                                        />
                                                        {previewUrls[index] && (
                                                            <div className="h-10 w-10 relative rounded border overflow-hidden shrink-0 bg-muted/50">
                                                                <img src={previewUrls[index]} alt="Preview" className="object-cover w-full h-full" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                {/* Name */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`brands.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Brand Name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                <TableCell className="align-top">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {fields.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                                    No brands added.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
