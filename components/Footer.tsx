import { BrandLink } from "./Brand";

type FooterLink = { href: string; label: string };

export function Footer({
  description,
  sectionTitle,
  sectionLinks,
}: {
  description: string;
  sectionTitle?: string;
  sectionLinks?: FooterLink[];
}) {
  return (
    <footer className="border-t border-ink py-14 pb-19 text-[15px] text-ink-2">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-11 px-gut md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLink className="mb-3.5" />
          <p className="mt-3.5 max-w-[46ch]">{description}</p>
        </div>
        {sectionTitle && sectionLinks && (
          <FooterColumn title={sectionTitle} links={sectionLinks} />
        )}
        <FooterColumn
          title="Denominator"
          links={[
            { href: "/", label: "Home" },
            { href: "/#principles", label: "Principles" },
            { href: "/#catalogue", label: "Published" },
            { href: "https://github.com/bigansh/denominator", label: "GitHub" },
          ]}
        />
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="mb-3 font-mono text-[10.5px] font-medium tracking-[.16em] text-ink-3 uppercase">
        {title}
      </h4>
      <ul className="list-none space-y-1.5 p-0">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="border-b border-rule text-ink no-underline hover:border-ink"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
