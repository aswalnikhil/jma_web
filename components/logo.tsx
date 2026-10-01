// Text wordmark stand-in until the official vector logo is supplied.
export function Logo({
  className = "",
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const light = tone === "light";
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        className={`h-8 w-8 ${light ? "text-on-primary" : "text-primary"}`}
        aria-hidden="true"
        fill="none"
      >
        <path
          d="M16 29c0-9 3-15 11-20-1.5 9-5.5 15-11 20Z"
          fill="currentColor"
        />
        <path
          d="M16 29c0-7-2.5-12-9-16 1 7.5 4 12.5 9 16Z"
          fill="currentColor"
          opacity=".55"
        />
        <circle cx="21" cy="5" r="2.5" className="fill-accent" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className={`font-serif text-xl font-bold tracking-tight ${light ? "text-on-primary" : "text-primary"}`}>
          JMA
        </span>
        <span className={`text-xs font-semibold tracking-[0.18em] uppercase ${light ? "text-on-primary/70" : "text-muted-foreground"}`}>
          Herbals
        </span>
      </span>
    </span>
  );
}
