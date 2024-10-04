import { auth } from "@/lib/auth";
import { prisma } from "@/lib/connect";
import { decrypt, encrypt } from "@/lib/encrypt";
import {
  Attribute,
  CartItem,
  Option,
  Variant,
  VariantAttribute,
} from "@/lib/types";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const cartCookieOpts: Partial<ResponseCookie> = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function validateCart() {
  const userId = (await auth())?.user?.id;
  const cookieCartId = cookies().has("cart")
    ? decrypt(cookies().get("cart")!.value)
    : undefined;

  if (userId && cookieCartId) {
    // User is logged in and has a cookie cart
    const cookieCartPromise = await prisma.cart.findFirst({
      where: {
        id: cookieCartId,
      },
      include: {
        cartItems: {
          include: {
            productVariant: {
              select: {
                productId: true,
              },
            },
          },
        },
      },
    });

    const userCartPromise = await prisma.cart.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
      include: {
        cartItems: {
          include: {
            productVariant: {
              select: {
                productId: true,
              },
            },
          },
        },
      },
    });

    const [cookieCart, userCart] = await Promise.all([
      cookieCartPromise,
      userCartPromise,
    ]);

    cookies().delete("cart");

    //add items items that werent alreadey in the userCart
    //IMPORTANT The expected behaviour us that itemsToAdd consists of new items NOT new item variants
    //if two same items with different variants are featred in both carts the user cart takes precedent
    const itemsToAdd = (cookieCart?.cartItems || []).filter(
      (cookieItem) =>
        !(userCart?.cartItems || []).some(
          (userItem) =>
            cookieItem.productVariant.productId ===
            userItem.productVariant.productId
        )
    );

    //either add items to existing user cart or create one with new items
    const { id } = await prisma.cart.upsert({
      where: { id: userCart?.id || "" },
      update: { cartItems: { createMany: { data: itemsToAdd } } },
      create: {
        user: { connect: { id: userId } },
        cartItems: { createMany: { data: itemsToAdd } },
      },
    });

    return id;
  } else if (userId && !cookieCartId) {
    // User is logged in but has no cookie cart
    const userCart = await prisma.cart.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!userCart) {
      const { id } = await prisma.cart.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return id;
    } else {
      return userCart.id;
    }
  } else if (!userId && cookieCartId) {
    // User is not logged in but has a cookie cart
    const cookieCart = await prisma.cart.findUnique({
      where: {
        id: cookieCartId,
      },
    });

    if (!cookieCart) {
      const { id } = await prisma.cart.create({});
      const encryptedId = encrypt(id);

      cookies().set("cart", encryptedId, cartCookieOpts);

      return id;
    } else {
      return cookieCart.id;
    }
  } else {
    // User is not logged in and has no cookie cart
    const { id } = await prisma.cart.create({});
    const encryptedId = encrypt(id);

    cookies().set("cart", encryptedId, cartCookieOpts);

    return id;
  }
}

export async function GET() {
  try {
    const cartId = "1"; //await validateCart();

    const cartItems = await prisma.product.findMany({
      where: {
        variants: {
          some: {
            cartItems: {
              some: {
                cartId: cartId,
              },
            },
          },
        },
      },
      include: {
        variants: {
          include: {
            properties: true,
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(cartItems), {
      status: 200,
    });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({
        message: "Unexpected error has occured. Orignal message :" + err,
      }),
      { status: 500 }
    );
  }
}
const temp = [
  {
    cartItemId: "e40dc0ec-1ff2-4a6a-82e6-52ecd77a1550",
    quantity: 2,
    name: "jeans",
    images: ["/no-image.svg"],
    attributes: [
      {
        attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
        attributeName: "material",
        options: [
          {
            attributeOptionId: "c19e5fef-104d-47c1-8fe5-24b52c31e40a",
            optionName: "denim",
            isDisabled: true,
            isSelected: true,
          },
          {
            attributeOptionId: "6fded1a9-0dc9-481a-a9c2-38ca3a93648a",
            optionName: "cotton",
            isDisabled: false,
            isSelected: false,
          },
        ],
      },
      {
        attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
        attributeName: "size",
        options: [
          {
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
            optionName: "L",
            isDisabled: true,
            isSelected: true,
          },
          {
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
            optionName: "XL",
            isDisabled: false,
            isSelected: false,
          },
          {
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
            optionName: "XS",
            isDisabled: true,
            isSelected: false,
          },
        ],
      },
    ],
    variants: [
      {
        variantId: "466d7b4f-e3fa-4e97-803b-6d00f66dc9a0",
        slug: "jeans-denim-l",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "c19e5fef-104d-47c1-8fe5-24b52c31e40a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 4999,
        isSelected: true,
        amountInStock: 10,
      },
      {
        variantId: "466d7b4f-e3fa-4e97-803b-6d00f66dc9a0",
        slug: "jeans-denim-l",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "c19e5fef-104d-47c1-8fe5-24b52c31e40a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 4999,
        isSelected: true,
        amountInStock: 10,
      },
      {
        variantId: "77a36981-11fe-4519-8a6b-ac6f02dde3bc",
        slug: "jeans-cotton-xl",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "6fded1a9-0dc9-481a-a9c2-38ca3a93648a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
          },
        ],
        priceInCents: 6999,
        isSelected: false,
        amountInStock: 12,
      },
      {
        variantId: "77a36981-11fe-4519-8a6b-ac6f02dde3bc",
        slug: "jeans-cotton-xl",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "6fded1a9-0dc9-481a-a9c2-38ca3a93648a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
          },
        ],
        priceInCents: 6999,
        isSelected: false,
        amountInStock: 12,
      },
      {
        variantId: "e1abf40f-9cab-4324-8922-025906a0247c",
        slug: "jeans-denim-xs",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "c19e5fef-104d-47c1-8fe5-24b52c31e40a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
          },
        ],
        priceInCents: 7999,
        isSelected: false,
        amountInStock: 3,
      },
      {
        variantId: "e1abf40f-9cab-4324-8922-025906a0247c",
        slug: "jeans-denim-xs",
        attributes: [
          {
            attributeId: "7557acd6-424b-4273-a6ca-46840c6a9e68",
            attributeOptionId: "c19e5fef-104d-47c1-8fe5-24b52c31e40a",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
          },
        ],
        priceInCents: 7999,
        isSelected: false,
        amountInStock: 3,
      },
    ],
  },
  {
    cartItemId: "9f1fba8a-c39c-44f3-8f7e-a380ef6620fc",
    quantity: 1,
    name: "t-shirt",
    images: ["/no-image.svg"],
    attributes: [
      {
        attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
        attributeName: "color",
        options: [
          {
            attributeOptionId: "7e69aa7e-58d6-4526-a74a-eca88d790e96",
            optionName: "black",
            isDisabled: true,
            isSelected: true,
          },
          {
            attributeOptionId: "63faa9cf-a4c0-4802-afb2-2642dc3d0039",
            optionName: "white",
            isDisabled: true,
            isSelected: false,
          },
          {
            attributeOptionId: "c32a4c29-191b-4fd8-8157-b006b91aa149",
            optionName: "green",
            isDisabled: false,
            isSelected: false,
          },
        ],
      },
      {
        attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
        attributeName: "size",
        options: [
          {
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
            optionName: "L",
            isDisabled: true,
            isSelected: true,
          },
          {
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
            optionName: "XS",
            isDisabled: true,
            isSelected: false,
          },
          {
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
            optionName: "XL",
            isDisabled: false,
            isSelected: false,
          },
        ],
      },
    ],
    variants: [
      {
        variantId: "f71d6055-42e7-4c38-a992-0f66d62e1771",
        slug: "t-shirt-black-l",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "7e69aa7e-58d6-4526-a74a-eca88d790e96",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 9999,
        isSelected: true,
        amountInStock: 2,
      },
      {
        variantId: "f71d6055-42e7-4c38-a992-0f66d62e1771",
        slug: "t-shirt-black-l",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "7e69aa7e-58d6-4526-a74a-eca88d790e96",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 9999,
        isSelected: true,
        amountInStock: 2,
      },
      {
        variantId: "fc18cefa-8d30-4624-8427-6cb314c6c6da",
        slug: "t-shirt-white-l",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "63faa9cf-a4c0-4802-afb2-2642dc3d0039",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 19999,
        isSelected: false,
        amountInStock: 4,
      },
      {
        variantId: "fc18cefa-8d30-4624-8427-6cb314c6c6da",
        slug: "t-shirt-white-l",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "63faa9cf-a4c0-4802-afb2-2642dc3d0039",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "5757a97a-0fcd-428a-8e58-f36c55a1b532",
          },
        ],
        priceInCents: 19999,
        isSelected: false,
        amountInStock: 4,
      },
      {
        variantId: "0c79a31c-4e41-493a-b5a9-07b379624f93",
        slug: "t-shirt-black-xs",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "7e69aa7e-58d6-4526-a74a-eca88d790e96",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
          },
        ],
        priceInCents: 24999,
        isSelected: false,
        amountInStock: 5,
      },
      {
        variantId: "0c79a31c-4e41-493a-b5a9-07b379624f93",
        slug: "t-shirt-black-xs",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "7e69aa7e-58d6-4526-a74a-eca88d790e96",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "0677b1c7-09b4-4e7c-afb7-d74088b7cad1",
          },
        ],
        priceInCents: 24999,
        isSelected: false,
        amountInStock: 5,
      },
      {
        variantId: "6276f4af-dbe7-4822-881d-e72d450f8e77",
        slug: "t-shirt-green-xl",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "c32a4c29-191b-4fd8-8157-b006b91aa149",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
          },
        ],
        priceInCents: 999,
        isSelected: false,
        amountInStock: 8,
      },
      {
        variantId: "6276f4af-dbe7-4822-881d-e72d450f8e77",
        slug: "t-shirt-green-xl",
        attributes: [
          {
            attributeId: "5cf7d5ab-62d8-4344-b811-d184f4375f0f",
            attributeOptionId: "c32a4c29-191b-4fd8-8157-b006b91aa149",
          },
          {
            attributeId: "9b8fc5b8-d0d5-4451-85ac-0c18e9a28699",
            attributeOptionId: "fedf587f-27e3-4f1f-aeff-cadf1c3f9260",
          },
        ],
        priceInCents: 999,
        isSelected: false,
        amountInStock: 8,
      },
    ],
  },
];
