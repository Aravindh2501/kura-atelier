import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full bg-surface-container rounded-full px-space-md py-space-sm font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/60 disabled:opacity-50";

type FieldProps = { label: string; error?: string; children?: ReactNode; className?: string } & InputHTMLAttributes<HTMLInputElement>;

export function Field({ label, error, className, children, id, ...input }: FieldProps) {
  const fieldId = id ?? `f-${input.name ?? label}`;
  return (
    <label htmlFor={fieldId} className={cn("flex flex-col gap-1.5", className)}>
      <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">{label}</span>
      {children ?? <input id={fieldId} aria-invalid={Boolean(error)} className={cn(inputClass, error && "ring-2 ring-error/60")} {...input} />}
      {error && <span role="alert" className="font-body-sm text-body-sm text-error">{error}</span>}
    </label>
  );
}

export const selectClass = cn(inputClass, "appearance-none pr-10");
