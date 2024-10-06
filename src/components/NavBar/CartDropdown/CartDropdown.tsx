"use client";

import { CircleCheck, Info, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  ScrollArea,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableCaption,
  Skeleton,
  RadioGroup,
  RadioGroupItem,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  PopoverArrow,
} from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { CartItem } from "@/lib/types";
import { useEffect, useRef } from "react";
import Image from "next/image";
import useCartStore from "@/lib/store/cartStore";
import { useQuery } from "react-query";
import { formatPrice } from "@/lib/utils";

async function fetchCartItems(): Promise<CartItem[]> {
  const res = await fetch(`${process.env.BASEURL}/api/cart`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch cart items");
  }
  return res.json();
}

export default function CartDropdown() {
  const {
    setCartItems,
    cartItems,
    incrementItemQuantity,
    decrementItemQuantity,
    setItemVariant,
    getTotalInCents,
  } = useCartStore();

  const { isLoading, error } = useQuery({
    queryFn: fetchCartItems,
    onSuccess: (data: CartItem[]) => setCartItems(data),
  });

  return (
    <>
      {/**MOBILE CART LINK */}
      <Button
        variant="ghost"
        size="icon"
        className="inline-flex sm:hidden rounded-full transition-transform hover:scale-[1.15]"
        asChild
      >
        <Link href="/cart">
          <ShoppingCart />
        </Link>
      </Button>

      {/**DESKTOP CART DROPDOWN */}
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full transition-transform hover:scale-[1.15]"
          >
            <ShoppingCart />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-2 w-fit">
          <PopoverArrow />
          <ScrollArea className="h-80 pb-2 rounded-md">
            {isLoading ? (
              <div className="w-full h-full flex flex-col justify-between">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <Table>
                <TableCaption>
                  {`Cart total : ${formatPrice(getTotalInCents())}`}
                </TableCaption>

                <TableBody>
                  {cartItems.map((cartItem) => (
                    <ProductTableRow
                      key={cartItem.id}
                      cartItem={cartItem}
                      incrementItemQuantity={incrementItemQuantity}
                      decrementItemQuantity={decrementItemQuantity}
                      setItemVariant={setItemVariant}
                    />
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
          <Button asChild className="w-full">
            <Link href="/cart">Go to cart</Link>
          </Button>
        </PopoverContent>
      </Popover>
    </>
  );
}

function ProductTableRow({
  cartItem,
  incrementItemQuantity,
  decrementItemQuantity,
  setItemVariant,
}: {
  cartItem: CartItem;
  incrementItemQuantity: (cartItemId: string) => void;
  decrementItemQuantity: (cartItemId: string) => void;
  setItemVariant: (
    cartItemId: string,
    newVaId: string,
    newVoId: string
  ) => void;
}) {
  const prevQuantityRef = useRef(cartItem.quantity);
  const priceInCentsRef = useRef(cartItem.selectedVariant?.priceInCents);

  useEffect(() => {
    prevQuantityRef.current = cartItem.quantity;
  }, [cartItem.quantity]);

  useEffect(() => {
    priceInCentsRef.current = cartItem.selectedVariant?.priceInCents;
  }, [cartItem.selectedVariant?.priceInCents]);

  const direction =
    cartItem.quantity > prevQuantityRef.current ? "increment" : "decrement";

  return (
    <TableRow>
      <TableCell className="relative w-28">
        <Link href={"/product/" + cartItem.product.slug}>
          <Image
            src={
              cartItem.product.images.length > 0
                ? cartItem.product.images[0]
                : "/no-image.svg"
            }
            alt={cartItem.product.name}
            fill
            className="object-contain border rounded max-h-[80%] m-[10%]"
          />
        </Link>
      </TableCell>
      <TableCell>
        <Button className="text-foreground" variant="link" asChild>
          <Link href={"/product/" + cartItem.product.slug}>
            {cartItem.product.name}
          </Link>
        </Button>
      </TableCell>
      <TableCell>
        <span className="flex items-center w-10">
          <div className="relative flex-1">
            <AnimatePresence
              initial={false}
              custom={direction}
              mode="popLayout"
            >
              <motion.span
                key={cartItem.quantity}
                custom={direction}
                variants={quantityVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {cartItem.quantity}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="space-y-0.5">
            <Button
              asChild
              className="rounded-t-full p-0 m-0 flex items-center justify-center w-3.5 h-5"
              disabled={
                cartItem.selectedVariant
                  ? cartItem.quantity >= cartItem.selectedVariant.stockCnt
                  : false
              }
              onClick={() => incrementItemQuantity(cartItem.id)}
            >
              <motion.button whileTap={{ scale: 0.95 }}>
                <Plus className="w-3 h-3" />
              </motion.button>
            </Button>
            <Button
              asChild
              className="rounded-b-full p-0 m-0 flex items-center justify-center w-3.5 h-5"
              disabled={cartItem.quantity <= 1}
              onClick={() => decrementItemQuantity(cartItem.id)}
            >
              <motion.button whileTap={{ scale: 0.95 }}>
                <Minus className="w-3 h-3" />
              </motion.button>
            </Button>
          </span>
        </span>
      </TableCell>
      <TableCell className="px-10">
        {cartItem.product.attributes.map((va) => (
          <div key={va.id} className="flex flex-col items-center mb-2">
            <Label htmlFor={va.name}>{va.name}</Label>
            <RadioGroup name={va.name} className="flex mt-1.5">
              {va.options.map((vo) => (
                <RadioGroupItem
                  key={`${va.id}-${vo.id}`}
                  value={`${va.id}-${vo.id}`}
                  onClick={() => setItemVariant(cartItem.id, va.id, vo.id)}
                  disabledStyle={vo.isDisabled}
                  checked={vo.isSelected}
                  text={vo.name}
                />
              ))}
            </RadioGroup>
          </div>
        ))}
      </TableCell>
      <TableCell className="relative w-20">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.span
            key={`${cartItem.selectedVariant?.priceInCents}${cartItem.quantity}`}
            custom={direction}
            variants={quantityVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-end"
          >
            {formatPrice(
              cartItem.selectedVariant
                ? cartItem.selectedVariant.priceInCents * cartItem.quantity
                : 0
            )}
          </motion.span>
        </AnimatePresence>
      </TableCell>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger className="m-1">
            {cartItem.selectedVariant ? (
              <CircleCheck
                strokeWidth="1.5"
                size={20}
                color="green"
                opacity={0.75}
              />
            ) : (
              <Info strokeWidth="1.5" size={20} color="red" opacity={0.75} />
            )}
          </TooltipTrigger>
          {!cartItem.selectedVariant && (
            <TooltipContent side="left">
              <p>This product isn't available.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </TableRow>
  );
}

const quantityVariants = {
  initial: (direction: string) => ({
    y: direction === "increment" ? -20 : 20,
    opacity: 0,
  }),
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    y: direction === "increment" ? 20 : -20,
    opacity: 0,
  }),
};
