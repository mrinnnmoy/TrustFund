"use client";

import { useState } from "react";

const faqs = [
  {
    question: "How Do I Donate To A Campaign?",
    answer:
      "Choose a campaign you want to support, connect your wallet, enter the amount you would like to contribute, and confirm the donation.",
  },
  {
    question: "How Do I Start A Fundraising Campaign?",
    answer:
      "Connect your wallet and select Start A Campaign. Add your campaign details, fundraising goal, deadline, and supporting information before publishing it.",
  },
  {
    question: "Are Donations Recorded On-Chain?",
    answer:
      "Yes. TrustFund uses Solana so campaign donations can be recorded on-chain, making fundraising activity transparent and independently verifiable.",
  },
  {
    question: "When Can Campaign Owners Withdraw Funds?",
    answer:
      "Campaign owners can withdraw available campaign funds according to the rules enforced by the TrustFund program.",
  },
  {
    question: "How Does TrustFund Keep Fundraising Transparent?",
    answer:
      "TrustFund combines on-chain donation records with publicly visible campaign information so supporters can follow how much a campaign has raised and verify its activity.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="mt-8 py-16 sm:mt-12 sm:py-20 lg:py-24">
      <h2 className="max-w-md text-4xl font-semibold leading-[1.08] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
        Frequently Asked
        <br />
        Questions.
      </h2>

      <div className="mt-10 border-b border-[var(--color-border)] sm:mt-12">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={faq.question}
              className="border-t border-[var(--color-border)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left sm:py-7"
              >
                <span className="text-lg font-medium tracking-[-0.03em] sm:text-xl lg:text-2xl">
                  {faq.question}
                </span>

                <span
                  aria-hidden="true"
                  className="shrink-0 text-3xl font-light leading-none text-[var(--color-muted)]"
                >
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="max-w-3xl pb-6 pr-12 sm:pb-7">
                  <p className="text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
