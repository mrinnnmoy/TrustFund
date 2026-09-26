import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/Button";

const communityImages = [
  {
    src: "/landing/community-01-group.webp",
    alt: "Community members together",
  },
  {
    src: "/landing/community-02-solo.webp",
    alt: "A member of the fundraising community",
  },
  {
    src: "/landing/community-03-celebrate.webp",
    alt: "Community members celebrating together",
  },
  {
    src: "/landing/community-04-mountains.webp",
    alt: "Community members outdoors",
  },
];

export function CommunityImpact() {
  return (
    <section
      id="about"
      className="relative min-h-125 overflow-hidden py-20 sm:min-h-140 g:min-h-155 lg:py-24"
    >
      <div className="mx-auto flex max-w-4xl translate-y-16 flex-col items-center text-center sm:translate-y-0">
        <p className="text-base font-semibold tracking-[-0.03em] sm:text-2xl lg:text-3xl">
          Be The Part Of FundRaisers With Over
        </p>

        <p className="mt-2 text-[3.5rem] font-semibold leading-none tracking-[-0.08em] sm:text-[clamp(4.5rem,11vw,10rem)]">
          217,924+
        </p>

        <p className="mt-3 text-sm font-semibold tracking-[-0.03em] sm:text-xl lg:text-2xl">
          People From Around The World Joined
        </p>

        <Link href="/create" className="mt-6 sm:mt-8">
          <Button
            variant="primary"
            className="px-6 py-2.5 text-sm sm:px-8 sm:py-3.5 sm:text-lg"
          >
            Join FundRaisers Now!
          </Button>
        </Link>
      </div>

      <div>
        <div className="absolute left-[3%] top-[13%] h-24 w-20 overflow-hidden rounded-md sm:left-[5%] sm:h-36 sm:w-28 lg:left-[7%] lg:h-48 lg:w-40">
          <Image
            src={communityImages[0].src}
            alt={communityImages[0].alt}
            fill
            sizes="160px"
            className="object-cover grayscale"
          />
        </div>

        <div className="absolute bottom-[6%] left-[12%] h-20 w-20 overflow-hidden rounded-md sm:left-[15%] sm:h-32 sm:w-32 lg:left-[18%] lg:h-44 lg:w-44">
          <Image
            src={communityImages[1].src}
            alt={communityImages[1].alt}
            fill
            sizes="176px"
            className="object-cover grayscale"
          />
        </div>

        <div className="absolute right-[3%] top-[13%] h-24 w-20 overflow-hidden rounded-md sm:right-[5%] sm:h-36 sm:w-28 lg:right-[7%] lg:h-48 lg:w-40">
          <Image
            src={communityImages[2].src}
            alt={communityImages[2].alt}
            fill
            sizes="160px"
            className="object-cover grayscale"
          />
        </div>

        <div className="absolute bottom-[6%] right-[12%] h-20 w-20 overflow-hidden rounded-md sm:right-[15%] sm:h-32 sm:w-32 lg:right-[18%] lg:h-44 lg:w-44">
          <Image
            src={communityImages[3].src}
            alt={communityImages[3].alt}
            fill
            sizes="176px"
            className="object-cover grayscale"
          />
        </div>
      </div>
    </section>
  );
}
