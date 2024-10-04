import { cn } from "@/lib/utils";
import {
  BlockquoteHTMLAttributes,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
} from "react";

type TextProps =
  | ParagraphProps
  | BlockquoteProps
  | CodeProps
  | SmallProps
  | LargeProps;

export default function Text({ as, children, className, ...props }: TextProps) {
  switch (as) {
    case "default":
      return (
        <p
          className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
          {...(props as Omit<ParagraphProps, "as">)}
        >
          {children}
        </p>
      );
    case "lead":
      return (
        <p
          className={cn("text-xl text-muted-foreground", className)}
          {...(props as Omit<ParagraphProps, "as">)}
        >
          {children}
        </p>
      );
    case "muted":
      return (
        <p
          className={cn("text-sm text-muted-foreground", className)}
          {...(props as Omit<ParagraphProps, "as">)}
        >
          {children}
        </p>
      );
    case "blockquote":
      return (
        <blockquote
          className={cn("mt-6 border-l-2 pl-6 italic", className)}
          {...(props as Omit<BlockquoteProps, "as">)}
        >
          {children}
        </blockquote>
      );
    case "code":
      return (
        <code
          className={cn(
            "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
            className
          )}
          {...(props as Omit<CodeProps, "as">)}
        >
          {children}
        </code>
      );
    case "small":
      return (
        <small
          className={cn("text-sm font-medium leading-none", className)}
          {...(props as Omit<SmallProps, "as">)}
        >
          {children}
        </small>
      );
    case "large":
      return (
        <div
          className={cn("text-lg font-semibold", className)}
          {...(props as Omit<LargeProps, "as">)}
        >
          {children}
        </div>
      );
  }
}
interface BaseTypographyProps {
  children?: ReactNode;
  className?: string;
}
interface ParagraphProps
  extends BaseTypographyProps,
    DetailedHTMLProps<
      HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    > {
  as: "default" | "lead" | "muted";
}
interface BlockquoteProps
  extends BaseTypographyProps,
    DetailedHTMLProps<
      BlockquoteHTMLAttributes<HTMLQuoteElement>,
      HTMLQuoteElement
    > {
  as: "blockquote";
}
interface CodeProps
  extends BaseTypographyProps,
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as: "code";
}
interface SmallProps
  extends BaseTypographyProps,
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  as: "small";
}
interface LargeProps
  extends BaseTypographyProps,
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  as: "large";
}
