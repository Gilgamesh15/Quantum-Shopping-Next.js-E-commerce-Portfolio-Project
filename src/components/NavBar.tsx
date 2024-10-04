/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Loader2,
  LucideIcon,
  Minus,
  Plus,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import {
  LogIn,
  UserPlus,
  User,
  Settings,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import { useQuery } from "react-query";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cartStore";
import { CartItem } from "@/lib/types";
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  useEffect,
  useRef,
  useState,
} from "react";

const fetchCartItems = async (): Promise<CartItem[]> => {
  const response = await fetch("http://localhost:3000/api/cart", {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
export default function NavBar() {
  const {
    cartItems,
    incrementCartItemQuantity,
    decrementCartItemQuantity,
    setItemVariant,
    setCartItems,
    getTotal,
  } = useCartStore();
  const { error, isLoading } = useQuery("cartItems", fetchCartItems, {
    onSuccess(data: CartItem[]) {
      setCartItems(data);
    },
  });

  const session = true;
  const isAdmin = false;

  function handleSignOut() {
    console.log("Signing out.\n");
  }
  return (
    <div className="border-b shadow bg-background fixed w-screen h-20">
      {/**CART LINK FOR SMALLER SCREENS*/}
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full transition-transform hover:scale-105 active:scale-95 sm:hidden"
        asChild
      >
        <Link href="/cart">
          <ShoppingCart />
        </Link>
      </Button>

      {/**CART POPOVER FOR LARGER SCREENS*/}
      <Popover defaultOpen>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full transition-transform hover:scale-105 active:scale-95 hidden sm:inline-flex"
          >
            <ShoppingCart />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px]">
          <ScrollArea className="h-[300px] pb-4 rounded-md">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-[48px] w-[566px]" />
                <Skeleton className="h-[89px] w-[566px]" />
                <Skeleton className="h-[89px] w-[566px]" />
                <Skeleton className="h-[89px] w-[566px]" />
                <Skeleton className="h-[89px] w-[566px]" />
                <Skeleton className="h-[89px] w-[566px]" />
              </div>
            ) : (
              <Table>
                <TableCaption>List of your cart products</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead className="pl-8">Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-center">Variant</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((product) => {
                    const selectedVariant = product.variants.find(
                      ({ isSelected }) => isSelected
                    );
                    if (!selectedVariant) {
                      throw new Error("Selected Variant not found");
                    }

                    return (
                      <TableRow key={product.cartItemId}>
                        <TableCell className="p-1">
                          <Link href={`/product/${selectedVariant.slug}`}>
                            <Image
                              src={
                                product.images.length > 0
                                  ? product.images[0]
                                  : "/no-image.svg"
                              }
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover rounded border min-w-20 min-h-20"
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            asChild
                            className="text-secondary-foreground"
                          >
                            <Link href={`/product/${selectedVariant.slug}`}>
                              {product.name}
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell>
                          <NumericStepper
                            value={product.quantity}
                            onIncrement={() =>
                              incrementCartItemQuantity(product.cartItemId)
                            }
                            onDecrement={() =>
                              decrementCartItemQuantity(product.cartItemId)
                            }
                          />
                        </TableCell>
                        <TableCell className="flex flex-col gap-4 items-center">
                          {product.attributes.map((attribute) => (
                            <div
                              className="flex gap-2 items-center justify-center"
                              key={attribute.attributeId}
                            >
                              {attribute.options.map((option) => {
                                const type = option.optionName;
                                console.log(option.isDisabled);
                                return (
                                  <label
                                    key={option.attributeOptionId}
                                    className={cn(
                                      "rounded bg-muted size-5 relative transition-all",
                                      option.isSelected
                                        ? "bg-primary ring-1 ring-primary ring-offset-1 text-primary-foreground scale-125"
                                        : "border-primary/50 border",
                                      option.isDisabled && "opacity-25"
                                    )}
                                  >
                                    <span className="absolute text-xs w-full h-full inline-flex items-center justify-center font-semibold">
                                      {option.optionName}
                                    </span>
                                    <input
                                      key={option.attributeOptionId}
                                      type="radio"
                                      checked={option.isSelected}
                                      onClick={() => {
                                        setItemVariant(
                                          product.cartItemId,
                                          attribute.attributeId,
                                          option.attributeOptionId
                                        );
                                      }}
                                    />
                                  </label>
                                );
                              })}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatPrice(
                            selectedVariant.priceInCents * product.quantity
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="text-right">
                      {formatPrice(getTotal())}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            )}
          </ScrollArea>

          <Button asChild>
            <Link
              href="/cart"
              className="w-full flex items-center justify-center gap-2"
            >
              <span> Go to cart</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
        </PopoverContent>
      </Popover>

      {/**USER PROFILE DROPDOWN */}
      <DropdownMenu>
        {/**TRIGGER RENDERED AS BUTTON WITH ICON  */}
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:scale-105 active:scale-95"
          >
            <UserRound />
          </Button>
        </DropdownMenuTrigger>

        {/**CONTENT */}
        <DropdownMenuContent className="space-y-0">
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {session ? (
            <>
              <CustomDropdownMenuItem
                href="/profile"
                icon={User}
                label="Profile"
              />
              <CustomDropdownMenuItem
                href="/profile/settings"
                icon={Settings}
                label="Settings"
              />
              {isAdmin && (
                <CustomDropdownMenuItem
                  href="/dashboard"
                  variant="primary"
                  icon={LayoutDashboard}
                  label="Dashboard"
                />
              )}
              <DropdownMenuSeparator />

              <CustomDropdownMenuItem
                type="button"
                variant="destructive"
                onClick={handleSignOut}
                icon={LogOut}
                label="Sign Out"
              />
            </>
          ) : (
            <>
              <CustomDropdownMenuItem
                href="/sign-in"
                icon={LogIn}
                label="Sign In"
              />
              <CustomDropdownMenuItem
                href="/sign-up"
                icon={UserPlus}
                label="Sign Up"
              />
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function NumericStepper({
  value,
  onDecrement,
  onIncrement,
}: {
  value: number;
  onIncrement: (...args: unknown[]) => void;
  onDecrement: (...args: unknown[]) => void;
}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  function handleIncrement() {
    if (!isAnimating) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        onIncrement();
        setIsAnimating(false);
        clearTimeout(timeout);
      }, 250);
    }
  }

  function handleDecrement() {
    if (!isAnimating) {
      setIsAnimating(true);
      const timeout = setTimeout(() => {
        onDecrement();
        setIsAnimating(false);
        clearTimeout(timeout);
      }, 250);
    }
  }

  return (
    <span className="flex items-center justify-between w-10">
      <span className="h-10 w-4 overflow-y-hidden">
        <span
          className="counter flex flex-col items-center relative -top-[26px] text-base space-y-[8px]"
          data-isAnimating={isAnimating}
        >
          <span>{value + 1}</span>
          <span>{value}</span>
          <span>{value - 1}</span>
        </span>
      </span>
      <span className="flex flex-col gap-0.5 w-3.5">
        <Button
          onClick={handleIncrement}
          className="rounded-t-full p-0 m-0 h-5"
          onMouseDown={() => {
            timeoutRef.current = setTimeout(() => {
              intervalRef.current = setInterval(handleIncrement, 300);
            }, 300);
          }}
          onMouseUp={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }}
        >
          <Plus />
        </Button>
        <Button
          onClick={handleDecrement}
          className="rounded-b-full p-0 m-0 h-5"
          onMouseDown={() => {
            timeoutRef.current = setTimeout(() => {
              intervalRef.current = setInterval(handleDecrement, 300);
            }, 300);
          }}
          onMouseUp={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }}
        >
          <Minus />
        </Button>
      </span>
    </span>
  );
}

type CustomDropdownMenuItemProps = {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "primary" | "destructive";
} & (
  | { type?: "button"; onClick: (...args: unknown[]) => void }
  | { type?: "link"; href: string }
);
function CustomDropdownMenuItem({
  icon: Icon,
  label,
  type = "link",
  variant = "default",
  ...rest
}: CustomDropdownMenuItemProps) {
  const path = usePathname();

  const isLink = "href" in rest;
  const isActive = isLink && path === rest.href;

  const content = (
    <>
      <Icon size={18} />
      {label}
    </>
  );

  const style = cn(
    "flex gap-4 items-center w-full h-full pr-6",
    {
      "text-destructive focus:bg-destructive focus:text-destructive-foreground":
        variant === "destructive",
      "text-primary focus:bg-primary focus:text-primary-foreground":
        variant === "primary",
    },
    isActive && "bg-secondary"
  );

  return (
    <DropdownMenuItem asChild>
      {isLink ? (
        <Link href={rest.href} className={style}>
          {content}
        </Link>
      ) : (
        <button onClick={rest.onClick} className={style}>
          {content}
        </button>
      )}
    </DropdownMenuItem>
  );
}
