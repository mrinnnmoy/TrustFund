import Image from "next/image";

const campaigns = [
  {
    image: "/landing/campaign-01-dogs.webp",
    organization: "Paws & Care",
    title: "SafePaws: Give Them A Home",
    raised: "42.8 SOL",
    daysLeft: "7 days left",
    progress: 78,
  },
  {
    image: "/landing/campaign-02-education.webp",
    organization: "Bright Future",
    title: "LearnForward: Education For All",
    raised: "31.4 SOL",
    daysLeft: "19 days left",
    progress: 62,
  },
  {
    image: "/landing/campaign-03-environment.webp",
    organization: "Earth Together",
    title: "GreenFund: Sustain Earth Now",
    raised: "24.6 SOL",
    daysLeft: "23 days left",
    progress: 48,
  },
];

export function UrgentFundraising() {
  return (
    <section className="pb-16 pt-4 lg:pb-20 lg:pt-6">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold tracking-[-0.04em] lg:text-4xl">
          Urgent Fundraising!
        </h2>

        <p className="mt-2 text-base leading-relaxed text-[var(--color-muted)] lg:text-lg">
          Time is of the essence! Join our mission NOW to make an immediate
          impact. Every second counts!
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {campaigns.map((campaign) => (
          <article key={campaign.title}>
            <div className="relative aspect-[2.45/1] overflow-hidden rounded-[var(--radius-md)]">
              <Image
                src={campaign.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="pt-3">
              <p className="text-sm text-[var(--color-muted)]">
                {campaign.organization}
                <span
                  className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-accent)] text-[9px] font-bold text-[var(--color-ink)]"
                  aria-label="Verified"
                >
                  ✓
                </span>
              </p>

              <h3 className="mt-1 text-lg font-semibold tracking-[-0.03em] lg:text-xl">
                {campaign.title}
              </h3>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--color-ink-10)]">
                <div
                  className="h-full rounded-full bg-[var(--color-accent)]"
                  style={{ width: `${campaign.progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-[family-name:var(--font-mono)] text-sm font-medium">
                  {campaign.raised}
                </span>

                <span className="text-sm text-[var(--color-muted)]">
                  {campaign.daysLeft}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
