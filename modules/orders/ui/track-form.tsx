type Props = {
  /** Page that handles the GET request, e.g. "/track". */
  action: string;
  defaultId?: string;
  defaultEmail?: string;
  error?: string;
};

/** Plain HTML GET form – works without JavaScript and keeps the lookup shareable as a URL. */
export function TrackForm({ action, defaultId = "", defaultEmail = "", error }: Props) {
  const input =
    "w-full bg-surface-container rounded-full px-space-md py-space-sm font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-secondary/60";
  const label = "font-label-md text-label-md uppercase tracking-wider text-on-surface-variant";

  return (
    <form action={action} method="get" className="flex flex-col gap-space-sm bg-surface-container-low rounded-lg p-space-lg shadow-sm">
      <label className="flex flex-col gap-1.5">
        <span className={label}>Order number</span>
        <input name="id" required defaultValue={defaultId} placeholder="KUR-7Q4M2XAB" autoCapitalize="characters" autoComplete="off" className={input} />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={label}>Email used at checkout</span>
        <input name="email" type="email" required defaultValue={defaultEmail} placeholder="you@example.com" autoComplete="email" className={input} />
      </label>
      {error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      )}
      <button type="submit" className="mt-space-xs bg-primary text-on-primary hover:bg-primary-container transition-colors rounded-full py-space-sm font-label-md text-label-md uppercase tracking-wider font-bold">
        Track order
      </button>
    </form>
  );
}
