import { BrandLink } from "./Brand";

const NAV = [
  { href: "/#catalogue", label: "Published" },
  { href: "https://github.com/bigansh/denominator", label: "GitHub ↗" },
];

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-3 px-gut py-4">
        <BrandLink />
        <nav className="flex gap-5">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="whitespace-nowrap border-b border-transparent font-mono text-[11px] tracking-[.1em] text-ink-2 uppercase no-underline hover:border-ink hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
