"use client";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "light" | "dark";
  placeholder?: string;
  cta?: string;
  doneLabel?: string;
};

type State = "idle" | "sending" | "done" | "error";

export function Newsletter({ variant = "light", placeholder = "Atelier correspondence address", cta = "Enroll", doneLabel = "Enrolled" }: Props) {
  const [state, setState] = useState<State>("idle");
  const [message, setMessage] = useState("");
  const dark = variant === "dark";

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "");
    setState("sending");
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Could not subscribe.");
      setState("done");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not subscribe.");
      setState("error");
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full max-w-md">
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row items-center gap-space-xs">
        <input
          required
          name="email"
          type="email"
          aria-label="Email address"
          placeholder={placeholder}
          disabled={state === "done"}
          className={cn(
            "w-full rounded-full px-space-md py-space-sm font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-secondary",
            dark ? "bg-primary-container text-on-primary placeholder:text-on-primary-container" : "bg-surface-container text-on-surface placeholder:text-outline",
          )}
        />
        <Button
          type="submit"
          variant="plain"
          size="none"
          disabled={state === "sending" || state === "done"}
          className={cn(
            "w-full sm:w-auto font-label-md text-label-md uppercase px-space-lg py-space-sm shrink-0 rounded-full transition-colors",
            dark ? "bg-surface text-primary hover:bg-surface-variant" : "bg-primary text-on-primary hover:bg-primary-container",
          )}
        >
          {state === "done" ? doneLabel : state === "sending" ? "Sending…" : cta}
        </Button>
      </form>
      {state === "error" && <p role="alert" className="font-body-sm text-body-sm text-error">{message}</p>}
    </div>
  );
}
