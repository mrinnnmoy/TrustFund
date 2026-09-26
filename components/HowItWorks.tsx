import type { ReactNode } from "react";

function CampaignIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M7 3.75h8.25L19 7.5v12.75H7V3.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M15 3.75V7.5h4M10 11h6M10 14.5h6M10 18h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path
        d="M13.25 2.75 6.5 13h5l-.75 8.25L17.5 11h-5l.75-8.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <circle
        cx="12"
        cy="12"
        r="8.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3.75 12h16.5M12 3.5c2.15 2.3 3.25 5.15 3.25 8.5S14.15 18.2 12 20.5C9.85 18.2 8.75 15.35 8.75 12S9.85 5.8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features: {
  icon: ReactNode;
  title: string;
  description: string;
}[] = [
  {
    icon: <CampaignIcon />,
    title: "Ignite Impact",
    description:
      "Spark joy by sharing your cause and the positive impact it brings. Clearly express how contributions will make a meaningful difference.",
  },
  {
    icon: <BoltIcon />,
    title: "Spread The Word",
    description:
      "Leverage the speed of social media and online networks. Share your fundraising campaign swiftly across various platforms.",
  },
  {
    icon: <GlobeIcon />,
    title: "Connect Globally",
    description:
      "Build a strong social network around your cause. Encourage supporters to share the campaign within their local communities.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-14 lg:py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] lg:text-4xl">
          Fund, Fast As Flash
        </h2>

        <p className="mt-2 max-w-5xl text-base leading-relaxed text-[var(--color-muted)] lg:text-lg">
          Fundraise at the speed of thought! Elevate your cause in just a minute
          with our lightning-fast fundraising platform.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="min-h-[220px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 lg:min-h-[250px] lg:p-8"
          >
            <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-dark)]">
              {feature.icon}
            </div>

            <h3 className="text-xl font-semibold tracking-[-0.03em]">
              {feature.title}
            </h3>

            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-muted)] lg:text-base">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
