import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CartItem, Properties, Variant } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findVariant(
  variants: Variant[],
  selectedProperties: Properties[]
): Variant | undefined {
  return variants.find((variant) =>
    selectedProperties.every((prop) =>
      variant.properties.some(
        (vProp) => vProp.attrId === prop.attrId && vProp.optId === prop.optId
      )
    )
  );
}

export function updateCartItemVariant(
  cartItem: CartItem,
  newProperties: Properties[]
): CartItem {
  const newVariant = findVariant(cartItem.product.variants, newProperties);
  if (newVariant) {
    return {
      ...cartItem,
      selectedVariant: newVariant,
    };
  }
  return cartItem;
}

export function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
    useGrouping: true,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    roundingMode: "ceil",
  }).format(priceInCents);
}

export function encrypt(text: string): string {
  //TODO Add encryption mechanism
  return text;
}

export function decrypt(text: string): string {
  //TODO Add decryption mechanism
  return text;
}
