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
import { Plus, Trash2, Ticket } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface PromoCodeManagerProps {
    form: UseFormReturn<any>
}

export function PromoCodeManager({ form }: PromoCodeManagerProps) {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "promoCodes",
    })

    return (
        <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium">Promo Codes</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm"
                    onClick={() =>
                        append({
                            code: "",
                            type: "percentage",
                            value: 0,
                            limit: 0,
                        })
                    }
                >
                    <Plus className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Add Code
                </Button>
            </div>

            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-3">
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
                            {/* Code */}
                            <FormField
                                control={form.control}
                                name={`promoCodes.${index}.code`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Code</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Ticket className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input placeholder="SUMMER25" className="pl-9 text-sm uppercase" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-2">
                                {/* Type */}
                                <FormField
                                    control={form.control}
                                    name={`promoCodes.${index}.type`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="text-xs h-9">
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="percentage">Percent (%)</SelectItem>
                                                    <SelectItem value="fixed">Fixed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Value */}
                                <FormField
                                    control={form.control}
                                    name={`promoCodes.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-xs">Value</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    className="text-sm h-9" 
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Limit */}
                            <FormField
                                control={form.control}
                                name={`promoCodes.${index}.limit`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs">Limit (0 for unlimited)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                className="text-sm h-9" 
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
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
                        No promo codes added.
                    </div>
                )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[200px]">Code</TableHead>
                            <TableHead className="w-[150px]">Type</TableHead>
                            <TableHead className="w-[120px]">Value</TableHead>
                            <TableHead className="w-[120px]">Usage Limit</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {fields.map((field, index) => (
                            <TableRow key={field.id}>
                                {/* Code */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.code`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Ticket className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                                        <Input placeholder="SUMMER25" className="pl-9 uppercase" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                {/* Type */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.type`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                {/* Value */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        min="0"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>

                                {/* Limit */}
                                <TableCell className="align-top">
                                    <FormField
                                        control={form.control}
                                        name={`promoCodes.${index}.limit`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input 
                                                        type="number" 
                                                        min="0"
                                                        placeholder="0 (Unlimited)"
                                                        {...field}
                                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                                    />
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
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No promo codes added.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
