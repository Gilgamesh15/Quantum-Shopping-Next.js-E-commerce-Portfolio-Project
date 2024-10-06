import { prisma } from "@/lib/connect";
import { CartItem, Product, Variant } from "@/lib/types";
import { NextResponse } from "next/server";

async function validateCart(): Promise<string> {
  return "id";
}
const images = [
  "/no-image.svg",
  "/no-image.svg",
  "/no-image.svg",
  "/no-image.svg",
  "/no-image.svg",
];

const black15inchTV: Variant = {
  id: "tv-black-15inch",
  priceInCents: 99999,
  images,
  stockCnt: 12,
  properties: [
    {
      attrId: "color",
      optId: "black",
    },
    {
      attrId: "size",
      optId: "15inch",
    },
  ],
};
const black13inchTV: Variant = {
  id: "tv-black-13inch",
  priceInCents: 999999,
  images,
  stockCnt: 8,
  properties: [
    {
      attrId: "color",
      optId: "black",
    },
    {
      attrId: "size",
      optId: "13inch",
    },
  ],
};
const white15inchTV: Variant = {
  id: "tv-white-15inch",
  priceInCents: 249999,
  images,
  stockCnt: 20,
  properties: [
    {
      attrId: "color",
      optId: "white",
    },
    {
      attrId: "size",
      optId: "15inch",
    },
  ],
};
const tv: Product = {
  id: "tv",
  slug: "tv",
  description: "Lorem Ipsum",
  name: "TV",
  images,
  attributes: [
    {
      id: "color",
      name: "color",
      options: [
        {
          id: "black",
          name: "black",
          isSelected: true,
          isDisabled: false,
        },
        {
          id: "white",
          name: "white",
          isSelected: false,
          isDisabled: true,
        },
      ],
    },
    {
      id: "size",
      name: "size",
      options: [
        {
          id: "13inch",
          name: "13inch",
          isSelected: true,
          isDisabled: false,
        },
        {
          id: "15inch",
          name: "15inch",
          isSelected: false,
          isDisabled: false,
        },
      ],
    },
  ],
  variants: [black13inchTV, black15inchTV, white15inchTV],
};
const blackXLtShirt: Variant = {
  id: "t-shirt-black-xl",
  priceInCents: 4999,
  images,
  stockCnt: 2,
  properties: [
    {
      attrId: "color",
      optId: "black",
    },
    {
      attrId: "size",
      optId: "XL",
    },
  ],
};
const blackLtShirt: Variant = {
  id: "t-shirt-black-l",
  priceInCents: 49999,
  images,
  stockCnt: 12,
  properties: [
    {
      attrId: "color",
      optId: "black",
    },
    {
      attrId: "size",
      optId: "L",
    },
  ],
};
const blackXStShirt: Variant = {
  id: "t-shirt-black-xs",
  priceInCents: 499,
  images,
  stockCnt: 22,
  properties: [
    {
      attrId: "color",
      optId: "black",
    },
    {
      attrId: "size",
      optId: "XS",
    },
  ],
};
const blueXLtShirt: Variant = {
  id: "t-shirt-blue-xl",
  priceInCents: 2999,
  images,
  stockCnt: 122,
  properties: [
    {
      attrId: "color",
      optId: "blue",
    },
    {
      attrId: "size",
      optId: "XL",
    },
  ],
};
const greenLtShirt: Variant = {
  id: "t-shirt-green-l",
  priceInCents: 29999999,
  images,
  stockCnt: 1,
  properties: [
    {
      attrId: "color",
      optId: "green",
    },
    {
      attrId: "size",
      optId: "L",
    },
  ],
};
const tShirt: Product = {
  id: "t-shirt",
  slug: "t-shirt",
  description: "Lorem Ipsum",
  name: "T-shirt",
  images,
  attributes: [
    {
      id: "color",
      name: "color",
      options: [
        {
          id: "black",
          name: "black",
          isSelected: true,
          isDisabled: false,
        },
        {
          id: "blue",
          name: "blue",
          isSelected: false,
          isDisabled: true,
        },
        {
          id: "green",
          name: "green",
          isSelected: false,
          isDisabled: true,
        },
      ],
    },
    {
      id: "size",
      name: "size",
      options: [
        {
          id: "L",
          name: "L",
          isSelected: false,
          isDisabled: false,
        },
        {
          id: "XL",
          name: "XL",
          isSelected: false,
          isDisabled: false,
        },
        {
          id: "XS",
          name: "XS",
          isSelected: true,
          isDisabled: false,
        },
      ],
    },
  ],
  variants: [
    blackLtShirt,
    blackXLtShirt,
    blackXStShirt,
    greenLtShirt,
    blueXLtShirt,
  ],
};
const mockCartItems: CartItem[] = [
  {
    id: "cart-item-1",
    quantity: 2,
    product: tv,
    selectedVariant: black13inchTV,
  },
  {
    id: "cart-item-2",
    quantity: 1,
    product: tShirt,
    selectedVariant: blackXStShirt,
  },
];

export async function GET() {
  try {
    const cartItems = mockCartItems;
    return new NextResponse(JSON.stringify(cartItems), { status: 200 });
  } catch (error) {
    console.error("Unexpected error has occured.\nError :\n" + error);
    return new NextResponse("Unexpected error has occured.", { status: 500 });
  }
}
