"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function Header() {
  const pathname = usePathname();

  // The landing page has its own finalized navigation.
  if (pathname === "/") {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/brand/logo-icon.svg"
          width={28}
          height={28}
          alt="TrustFund"
        />
        <span className="font-semibold">TrustFund</span>
      </Link>

      <nav className="flex items-center gap-6 text-sm">
        <Link href="/campaigns">Campaigns</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/create">Create</Link>
        <Link href="/dashboard">Dashboard</Link>
        <ConnectWalletButton />
      </nav>
    </header>
  );
}
