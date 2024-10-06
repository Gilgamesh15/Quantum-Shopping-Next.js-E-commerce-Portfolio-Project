export interface Properties {
  attrId: string;
  optId: string;
}

export interface Attribute {
  id: string;
  name: string;
  options: Option[];
}

export interface Option {
  id: string;
  name: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  variants: Variant[];
  attributes: Attribute[];
  images: string[];
}

export interface Variant {
  id: string;
  properties: Properties[];
  priceInCents: number;
  stockCnt: number;
  isSelected?: boolean;
  images: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVariant?: Variant;
  quantity: number;
}
