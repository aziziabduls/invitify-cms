import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (str: string): string => {
  if (typeof str !== "string" || !str.trim()) return "?";

  return (
    str
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "?"
  );
};

// export function formatCurrency(
//   amount: number,
//   opts?: {
//     currency?: string;
//     locale?: string;
//     minimumFractionDigits?: number;
//     maximumFractionDigits?: number;
//     noDecimals?: boolean;
//   },
// ) {
//   const { currency = "USD", locale = "en-US", minimumFractionDigits, maximumFractionDigits, noDecimals } = opts ?? {};

//   const formatOptions: Intl.NumberFormatOptions = {
//     style: "currency",
//     currency,
//     minimumFractionDigits: noDecimals ? 0 : minimumFractionDigits,
//     maximumFractionDigits: noDecimals ? 0 : maximumFractionDigits,
//   };

//   return new Intl.NumberFormat(locale, formatOptions).format(amount);
// }


export function formatCurrency(
  amount: number,
  opts?: {
    currency?: "USD" | "IDR" | "EUR" | "SGD";
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    noDecimals?: boolean;
  },
) {
  const {
    currency = "USD",
    minimumFractionDigits,
    maximumFractionDigits,
    noDecimals,
  } = opts ?? {};

  // Mapping locale sesuai currency
  const currencyLocaleMap: Record<string, string> = {
    USD: "en-US", // 1,234.56
    IDR: "id-ID", // 1.234,56
    EUR: "de-DE", // 1.234,56 (umum EU style)
    SGD: "en-SG", // 1,234.56
  };

  const locale = currencyLocaleMap[currency];

  // Default fraction digits
  const defaultFraction = currency === "IDR" ? 0 : 2;

  const formatOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency,
    minimumFractionDigits: noDecimals
      ? 0
      : minimumFractionDigits ?? defaultFraction,
    maximumFractionDigits: noDecimals
      ? 0
      : maximumFractionDigits ?? defaultFraction,
  };

  return new Intl.NumberFormat(locale, formatOptions).format(amount);
}

// export function formatCurrency(
//   amount: number,
//   opts?: {
//     currency?: "USD" | "IDR" | "EUR" | "SGD";
//     minimumFractionDigits?: number;
//     maximumFractionDigits?: number;
//     noDecimals?: boolean;
//   },
// ) {
//   const {
//     currency = "USD",
//     minimumFractionDigits,
//     maximumFractionDigits,
//     noDecimals,
//   } = opts ?? {};

//   const currencyLocaleMap: Record<string, string> = {
//     USD: "en-US",
//     IDR: "id-ID",
//     EUR: "de-DE",
//     SGD: "en-SG",
//   };

//   const locale = currencyLocaleMap[currency];

//   const defaultFraction = currency === "IDR" ? 0 : 2;

//   const formattedNumber = new Intl.NumberFormat(locale, {
//     minimumFractionDigits: noDecimals
//       ? 0
//       : minimumFractionDigits ?? defaultFraction,
//     maximumFractionDigits: noDecimals
//       ? 0
//       : maximumFractionDigits ?? defaultFraction,
//   }).format(amount);

//   return `${currency} ${formattedNumber}`;
// }
