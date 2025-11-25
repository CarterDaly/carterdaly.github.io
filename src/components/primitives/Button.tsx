import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

type Props = React.ComponentProps<"a"> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center gap-2 px-5 py-3 text-[12px] uppercase tracking-[0.2em] border transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--accent-primary)] text-[var(--color-text)] border-[var(--accent-primary)] hover:bg-transparent hover:text-[var(--accent-primary)]",
  secondary:
    "text-[var(--accent-tertiary)] border-[rgba(216,207,196,0.35)] hover:border-[var(--accent-tertiary)] hover:text-[var(--color-text)]",
  ghost:
    "text-[var(--accent-primary)] border-[var(--accent-primary)] hover:text-[var(--color-text)] hover:bg-[var(--accent-primary)]",
};

export function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <a
      className={clsx(base, variants[variant], className)}
      {...rest}
    >
      {children}
    </a>
  );
}
