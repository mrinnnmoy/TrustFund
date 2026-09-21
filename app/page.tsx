import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Image
          src="/brand/logo-full.svg"
          alt="TrustFund"
          width={180}
          height={48}
          priority
        />

        <Badge tone="success">Built on Solana</Badge>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-6 py-24">
        <Badge>TRANSPARENT FUNDRAISING</Badge>

        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          Give with confidence.
          <br />
          <span className="text-[var(--color-accent-dark)]">
            Make an impact.
          </span>
        </h1>

        <p className="max-w-xl text-lg leading-relaxed text-[var(--color-muted)]">
          TrustFund brings transparent fundraising to Solana.
          Every contribution is recorded on-chain.
        </p>

        <Button>Explore campaigns</Button>
      </section>
    </main>
  );
}