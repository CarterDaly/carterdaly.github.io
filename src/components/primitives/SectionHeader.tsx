import React from "react";
import clsx from "clsx";

type Props = {
  label?: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ label, title, description, className }: Props) {
  return (
    <div className={clsx("flex flex-col gap-3", className)}>
      {label ? <span className="eyebrow">{label}</span> : null}
      <h2 className="text-3xl md:text-4xl font-semibold text-[var(--color-text)]">{title}</h2>
      {description ? <p className="max-w-2xl text-[var(--color-muted)] leading-relaxed">{description}</p> : null}
    </div>
  );
}
