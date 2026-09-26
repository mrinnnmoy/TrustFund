import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-130 overflow-hidden rounded-lg lg:min-h-162.5">
      <Image
        src="/landing/hero.webp"
        alt="Two people reaching toward each other"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 sm:gap-4 px-5 py-7 text-white sm:flex-row sm:items-end sm:justify-between sm:p-10 lg:gap-8 lg:p-12">
        <div className="flex w-fit flex-col gap-3 sm:contents">
          <div className="flex items-end gap-3 sm:gap-7">
            <h1 className="m-0 text-[13.5vw] font-semibold leading-[0.72] tracking-[-0.07em]">
              <span className="inline-block translate-y-[-0.07em]">Trust</span>
            </h1>

            <p className="m-0 flex flex-col justify-end text-[6vw] font-semibold tracking-[-0.04em]">
              <span className="block leading-[0.78]">Help</span>
              <span className="block leading-[0.78]">Others</span>
            </p>
          </div>

          <Link href="/create" className="w-full pb-1 sm:w-auto sm:shrink-0 sm:pb-0">
            <Button
              variant="primary"
              className="w-full px-6 py-2.5 text-sm whitespace-nowrap sm:w-auto sm:px-8 sm:py-3.5 sm:text-lg"
            >
              Start Fundraising
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
