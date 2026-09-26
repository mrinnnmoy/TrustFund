"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/Button";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Donation", href: "/campaigns" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About Us", href: "#about" },
];

export function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative w-full px-6 py-4 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="TrustFund home">
            <Image
              src="/brand/logo-full.svg"
              alt="TrustFund"
              width={150}
              height={40}
              priority
            />
          </Link>

          <div className="hidden h-5 w-px bg-[var(--color-border)] md:block" />

          <nav className="hidden items-center gap-8 font-[family-name:var(--font-body)] text-[13px] font-medium tracking-[-0.01em] md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition-opacity hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:block">
          <Link href="/create">
            <Button variant="primary" className="px-6">
              Start a campaign
            </Button>
          </Link>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="sr-only">
            {menuOpen ? "Close menu" : "Open menu"}
          </span>

          <div className="flex w-6 flex-col gap-1.5">
            <span
              className={`h-[2px] w-full bg-[var(--color-ink)] transition-transform ${
                menuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-[2px] w-full bg-[var(--color-ink)] transition-opacity ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-[2px] w-full bg-[var(--color-ink)] transition-transform ${
                menuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute left-6 right-6 top-full z-50 mt-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-paper)] p-5 shadow-[var(--shadow-soft)] md:hidden">
          <nav className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="border-b border-[var(--color-border)] py-3.5 text-sm font-medium last:border-b-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/create"
            onClick={() => setMenuOpen(false)}
            className="mt-5 block"
          >
            <Button variant="primary" className="w-full">
              Start a campaign
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
