import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceInCents: number | undefined): string {
  if (!priceInCents) {
    console.log("ERROR");
    return "";
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    currencySign: "standard",
    currencyDisplay: "narrowSymbol",
    signDisplay: "never",
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: "ceil",
  }).format(priceInCents / 100);
}
