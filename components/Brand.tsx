import Link from "next/link";

/** The gradient rule-bar mark — the seven-stop data ramp, used as the logo. */
export function RuleBar({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-[9px] w-[26px] -translate-y-px ${className}`}
      style={{
        background:
          "linear-gradient(90deg, var(--color-s0), var(--color-s1), var(--color-s2), var(--color-s3), var(--color-s4), var(--color-s5), var(--color-s6))",
      }}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-semibold text-[19px] tracking-[-.02em] ${className}`}>
      Denominator
    </span>
  );
}

export function BrandLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-baseline gap-2.5 shrink-0 ${className}`}>
      <RuleBar />
      <Wordmark />
    </Link>
  );
}
