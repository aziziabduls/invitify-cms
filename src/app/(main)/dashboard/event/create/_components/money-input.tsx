"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"

interface MoneyInputProps {
    value?: number
    onChange: (value: number) => void
    onBlur?: () => void
    placeholder?: string
    className?: string
}

export function MoneyInput({ value, onChange, onBlur, placeholder, className }: MoneyInputProps) {
    const [displayValue, setDisplayValue] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (!isFocused) {
            if (value === undefined || value === null) {
                setDisplayValue("")
            } else {
                setDisplayValue(new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }).format(value))
            }
        }
    }, [value, isFocused])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value
        
        // Validate input: allow digits, one decimal point, and commas
        // We will strip commas for the raw value check
        const rawValue = inputValue.replace(/,/g, "")
        
        // Regex allows: empty string, digits, decimal point, digits after decimal
        if (rawValue === "" || /^\d*\.?\d*$/.test(rawValue)) {
            setDisplayValue(inputValue)
            const numberValue = parseFloat(rawValue)
            if (!isNaN(numberValue)) {
                onChange(numberValue)
            } else if (rawValue === "") {
                onChange(0)
            }
        }
    }

    const handleBlur = () => {
        setIsFocused(false)
        if (onBlur) onBlur()
    }

    const handleFocus = () => {
        setIsFocused(true)
        if (value !== undefined && value !== null) {
            // When focusing, show the raw number without commas for easy editing
            // If it's 0, we can show "" to make it easier to type a new price, 
            // or show "0" if preferred. Let's show "0" if it's strictly 0, or "" if it was empty?
            // Actually, usually users prefer to see the number they are editing.
            setDisplayValue(value === 0 ? "" : value.toString())
        }
    }

    return (
        <Input
            type="text"
            inputMode="decimal"
            placeholder={placeholder}
            className={className}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
        />
    )
}
