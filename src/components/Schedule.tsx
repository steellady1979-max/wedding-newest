import { Reveal } from "./Reveal";
import { SparkleTitle } from "./SparkleTitle";
import { Church, MapPin, PenLine, UtensilsCrossed } from "lucide-react";

const potiImg = "/__l5e/assets-v1/f303af79-1d4b-4079-9fee-399bbfa0c73d/poti-cathedral.jpg";
const bagrationiImg = "/__l5e/assets-v1/3ef1f9c0-4146-46fe-8cd5-64190b4ce890/bagrationi.jpg";

const ITEMS = [
  {
    time: "16:00",
    icon: Church,
    title: "ჯვრისწერა — ფოთის საკათედრო ტაძარი",
    map: "https://maps.app.goo.gl/m6CqeUWnruJGZgwd8",
    image: potiImg,
    alt: "ფოთის საკათედრო ტაძარი, აკვარელი",
  },
  {
    time: "17:30",
    icon: PenLine,
    title: "ხელის მოწერა — კოლხეთის ეროვნული პარკი",
    map: "https://maps.app.goo.gl/b8gDZjxaj6KcoKEL9",
    image: null as string | null,
    alt: "",
  },
  {
    time: "19:00",
    icon: UtensilsCrossed,
    title: "სადილი — რესტორანი „ბაგრატიონი“",
    map: "https://maps.app.goo.gl/bTKfJS68hFJpdzG79",
    image: bagrationiImg,
    alt: "რესტორანი ბაგრატიონი, აკვარელი",
  },
];


export function Schedule() {
  return (
    <section className="bg-backdrop px-0 pb-4 sm:px-6">
      <div className="mx-auto max-w-none sm:max-w-3xl">
        <Reveal>
          <div className="rounded-none border-x-0 border-t-0 border-b border-ink/10 bg-parchment/95 py-5 shadow-none sm:rounded-2xl sm:border sm:p-7 sm:shadow-soft">
            <div className="px-5 sm:px-0">
              <SparkleTitle className="font-geo text-lg tracking-[0.15em]">დღის განრიგი</SparkleTitle>
            </div>
            <ol className="mt-6 grid gap-5">
              {ITEMS.map(({ time, icon: Icon, title, map, image, alt }, i) => (
                <li key={time} className="relative flex gap-4">
                  <div className="flex flex-col items-center pl-5 sm:pl-1">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-wine/20 bg-wine/10">
                      <Icon className="h-4 w-4 text-wine" strokeWidth={1.5} />
                    </span>
                    {i < ITEMS.length - 1 && <span className="mt-1 w-px flex-1 bg-ink/15" />}
                  </div>
                  <div className="min-w-0 flex-1 pb-1 pr-5 sm:pr-0">
                    <p className="font-geo text-xs tracking-[0.25em] text-ink/55">{time}</p>
                    <p className="font-geo text-base text-ink">{title}</p>
                    <a
                      href={map}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 rounded-full border border-wine/25 px-4 py-1.5 font-geo text-xs tracking-[0.15em] text-wine transition hover:bg-wine hover:text-parchment"
                    >
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                      რუკაზე ნახვა
                    </a>
                    {image && (
                      <div className="mt-4 flex justify-center -ml-[3.25rem] sm:ml-0">
                        <img
                          src={image}
                          alt={alt}
                          loading="lazy"
                          className="mx-auto w-full max-w-sm rounded-none border-y border-ink/10 shadow-soft sm:max-w-md sm:rounded-xl sm:border"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
