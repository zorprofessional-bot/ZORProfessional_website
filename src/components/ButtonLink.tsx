import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  onDark?: boolean;
  className?: string;
} & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "aria-label">;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zor-blue text-white shadow-[0_18px_40px_rgba(11,59,117,0.22)] hover:bg-zor-blue-deep",
  secondary:
    "border border-zor-line bg-white/86 text-zor-blue shadow-sm hover:border-zor-blue/35 hover:bg-white",
  ghost: "text-zor-blue hover:bg-zor-blue-soft",
};

const darkVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-zor-blue-deep hover:bg-zor-blue-soft",
  secondary: "border border-white/25 bg-white/10 text-white hover:bg-white/16",
  ghost: "text-white hover:bg-white/10",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  onDark = false,
  className,
  ...props
}: ButtonLinkProps) {
  const isExternal =
    href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
  const opensNewTab = href.startsWith("http");
  const classes = cn(
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-zor-blue/40 focus-visible:ring-offset-2",
    onDark ? darkVariantClasses[variant] : variantClasses[variant],
    className,
  );

  if (isExternal) {
    return (
      <a
        className={classes}
        href={href}
        rel={opensNewTab ? "noreferrer" : undefined}
        target={opensNewTab ? "_blank" : undefined}
        {...props}
      >
        <span>{children}</span>
        {variant !== "ghost" ? <ArrowRight aria-hidden size={16} strokeWidth={2.2} /> : null}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} {...props}>
      <span>{children}</span>
      {variant !== "ghost" ? <ArrowRight aria-hidden size={16} strokeWidth={2.2} /> : null}
    </Link>
  );
}
