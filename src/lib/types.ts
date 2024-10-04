export interface CartItem extends Omit<Product, "id"> {
  id: string;
  quantity: number;
}
export interface StoreCartItem
  extends Omit<Omit<CartItem, "variant">, "attributes"> {
  attributes: StoreAttribute[];
  variants: StoreVariant[];
}
export interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  attributes: Attribute[];
  variants: Variant[];
}
export interface StoreVariant extends Variant {
  isSelected: boolean;
}
export interface Variant {
  id: string;
  priceInCents: number;
  images: string[];
  amountInStock: number;
  properties: VariantProperty[];
}
export interface StoreAttribute extends Omit<Attribute, "options"> {
  options: StoreOption[];
}
export interface Attribute {
  id: string;
  name: string;
  options: Option[];
}
export interface StoreOption extends Option {
  isSelected: boolean;
  isDisabled: boolean;
}
export interface Option {
  id: string;
  name: string;
}

export interface VariantProperty {
  attributeId: string;
  optionId: string;
}
