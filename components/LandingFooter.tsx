import Image from "next/image";
import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Campaigns", href: "/campaigns" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Start A Campaign", href: "/create" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Transparency", href: "/#about" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Contact", href: "#" },
    ],
  },
];

function SocialIcon({ social }: { social: string }) {
  const className = "h-4 w-4";

  switch (social) {
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.4" cy="6.7" r="1" fill="currentColor" />
        </svg>
      );

    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M13.6 21v-8h2.8l.42-3.2H13.6V7.76c0-.93.26-1.56 1.61-1.56H17V3.34c-.31-.04-1.37-.14-2.61-.14-2.58 0-4.35 1.58-4.35 4.47V9.8H7.12V13h2.92v8h3.56Z" />
        </svg>
      );

    case "X":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M4.4 3.5h4.7l3.76 5.02 4.34-5.02h2.06l-5.44 6.3 6.18 8.25h-4.7l-4.11-5.49-4.75 5.49H4.38l5.85-6.77L4.4 3.5Zm3.66 1.6H7.6l8.74 11.35h.46L8.06 5.1Z" />
        </svg>
      );

    case "LinkedIn":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
          <path d="M6.4 8.2H3.3V18h3.1V8.2ZM4.85 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM11.4 8.2H8.43V18h3.1v-4.85c0-1.28.24-2.52 1.83-2.52 1.57 0 1.59 1.47 1.59 2.6V18h3.1v-5.38c0-2.64-.57-4.67-3.65-4.67-1.48 0-2.47.81-2.87 1.58h-.04V8.2h-.09Z" />
        </svg>
      );

    default:
      return null;
  }
}

export function LandingFooter() {
  return (
    <footer className="px-6 pb-6 lg:px-8 lg:pb-8">
      <div className="rounded-[var(--radius-md)] bg-black px-6 py-10 text-white sm:px-8 lg:px-12 lg:py-12">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr] lg:gap-20">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/brand/logo-icon.svg"
                alt=""
                width={34}
                height={34}
                className="h-8 w-8"
              />
              <span className="text-2xl font-semibold tracking-[-0.04em]">
                TrustFund
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Transparent fundraising powered by Solana. Support meaningful
              causes and follow every contribution on-chain.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold">{group.title}</h3>

                <div className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="w-fit text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="my-9 h-px bg-white/15" />

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            © 2026 TrustFund. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-3">
            {["Instagram", "Facebook", "X", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                aria-label={`TrustFund on ${social}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/50 hover:text-white"
              >
                <SocialIcon social={social} />
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
