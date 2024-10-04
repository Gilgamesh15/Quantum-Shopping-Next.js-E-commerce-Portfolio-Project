import { cn } from "@/lib/utils";
import { DetailedHTMLProps, HTMLAttributes } from "react";

interface HeadingProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  as: "h1" | "h2" | "h3" | "h4";
  children?: React.ReactNode;
  className?: string;
}

export default function Heading({
  as: HeadingElement,
  children,
  className,
  ...props
}: HeadingProps) {
  return (
    <HeadingElement
      className={cn(
        {
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl":
            HeadingElement === "h1",
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0":
            HeadingElement === "h2",
          "scroll-m-20 text-2xl font-semibold tracking-tight":
            HeadingElement === "h3",
          "scroll-m-20 text-xl font-semibold tracking-tight":
            HeadingElement === "h4",
        },
        className
      )}
      {...props}
    >
      {children}
    </HeadingElement>
  );
}
