import { Reveal } from "./Reveal";
import { SparkleTitle } from "./SparkleTitle";
import { Church, MapPin, PenLine, UtensilsCrossed } from "lucide-react";

const samtavroImg = "/__l5e/assets-v1/8f705a39-8919-40f4-b244-290df1e859ce/samtavro.jpg";
const shuaguliImg = "/__l5e/assets-v1/644718fa-e492-41e9-a3e0-64ae7b57c0f6/shuaguli.jpg";
const erisoniImg = "/__l5e/assets-v1/9977bf9d-07a2-4242-8e20-76619d0db794/erisoni.jpg";

const ITEMS = [
  {
    time: "13:00",
    icon: Church,
    title: "ჯვრისწერა — მცხეთა, სამთავროს მონასტერი",
    map: "https://maps.app.goo.gl/9G7zSaaPB2VHoL3HA",
    image: samtavroImg,
    alt: "სამთავროს მონასტერი მცხეთაში, აკვარელი",
  },
  {
    time: "14:00 — 14:30",
    icon: PenLine,
    title: "ხელის მოწერა — შუაგული",
    map: "https://maps.app.goo.gl/UTsAjj4XQsWNQgcG7",
    image: shuaguliImg,
    alt: "ხელის მოწერის ცერემონია შუაგულში, აკვარელი",
  },
  {
    time: "18:00",
    icon: UtensilsCrossed,
    title: "ვახშამი — რესტორანი „ერისონი“",
    map: "https://maps.app.goo.gl/dD8MyPFMaakbngUz7",
    image: erisoniImg,
    alt: "რესტორანი ერისონი საღამოს, აკვარელი",
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
