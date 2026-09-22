import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SparkleTitle } from "@/components/SparkleTitle";
import { supabase } from "@/integrations/supabase/client";
import { sendToGoogleSheets } from "@/lib/googleSheets";

type Entry = { text: string; name: string };

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState<null | { dir: 1 | -1; from: number; to: number }>(null);
  const [paused, setPaused] = useState(false);
  const [writing, setWriting] = useState(false);
  
  const [nameInput, setNameInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchWishes = async () => {
    try {
      const { data, error } = await supabase
        .from("wishes")
        .select("full_name, message, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Supabase fetch error:", error.message);
        return;
      }

      if (data && data.length > 0) {
        setEntries(data.map(item => ({ name: item.full_name, text: item.message })));
      }
    } catch (err) {
      console.error("Fetch exception:", err);
    }
  };

  useEffect(() => {
    void fetchWishes();
  }, []);

  const handleSendClick = async () => {
    if (!nameInput.trim() || !textInput.trim()) {
      alert("გთხოვთ შეავსოთ ორივე ველი!");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending data to Supabase...", { nameInput, textInput });
      const fullName = nameInput.trim();
      const message = textInput.trim();
      const responseId = crypto.randomUUID();
      const [{ error }, sheetResult] = await Promise.all([
        supabase.from("wishes").insert([{ full_name: fullName, message }]),
        sendToGoogleSheets({ type: "wish", responseId, fullName, message }).then(
          () => null,
          (sheetError: unknown) => sheetError,
        ),
      ]);

      if (error || sheetResult) {
        console.error("Wish submission error", { dbError: error, sheetError: sheetResult });
        alert("ვერ გაიგზავნა, სცადეთ ხელახლა");
        setLoading(false);
        return;
      }

      alert("სურვილი წარმატებით გაიგზავნა!");
      setNameInput("");
      setTextInput("");
      setWriting(false);
      await fetchWishes();
    } catch (err: any) {
      alert("კრიტიკული შეცდომა: " + (err?.message || "უცნობი"));
    } finally {
      setLoading(false);
    }
  };

  const spreads: Entry[][] = [];
  for (let i = 0; i < entries.length; i += 2) spreads.push(entries.slice(i, i + 2));
  if (spreads.length === 0) spreads.push([]);
  const total = spreads.length;

  const turn = useCallback(
    (dir: 1 | -1) => {
      if (flip || total < 2) return;
      const from = page;
      const to = (page + dir + total) % total;
      setFlip({ dir, from, to });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setPage(to);
        setFlip(null);
      }, 900);
    },
    [flip, page, total],
  );

  useEffect(() => {
    if (paused || writing || total < 2 || flip) return;
    const id = setInterval(() => turn(1), 6000);
    return () => clearInterval(id);
  }, [paused, writing, total, flip, turn]);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const current = spreads[page] ?? [];
  const next = flip ? (spreads[flip.to] ?? []) : current;

  return (
    <section className="bg-backdrop px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <SparkleTitle className="font-geo text-2xl text-parchment" shimmer={false}>
            სურვილების წიგნი
          </SparkleTitle>
        </Reveal>

        <Reveal delay={120}>
          <div
            className="book mx-auto mt-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="book-inner">
              <PageFace side="left" entry={current[0]} />
              <PageFace side="right" entry={flip ? next[1] : current[1]} />

              {flip && (
                <div className={`book-leaf ${flip.dir === 1 ? "turn-fwd" : "turn-back"}`}>
                  <div className="book-leaf-face front">
                    <PageBody entry={flip.dir === 1 ? current[1] : next[1]} />
                  </div>
                  <div className="book-leaf-face back">
                    <PageBody entry={flip.dir === 1 ? next[0] : current[0]} />
                  </div>
                </div>
              )}

              <div className="book-spine" aria-hidden />
            </div>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => turn(-1)}
            aria-label="წინა გვერდი"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-wine/25 text-wine transition hover:bg-wine hover:text-parchment"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            {spreads.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`გვერდი ${i + 1}`}
                onClick={() => {
                  if (i === page || flip) return;
                  setPaused(true);
                  turn(i > page ? 1 : -1);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-6 bg-wine" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => turn(1)}
            aria-label="შემდეგი გვერდი"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-wine/25 text-wine transition hover:bg-wine hover:text-parchment"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-8">
          {writing ? (
            <div className="mx-auto grid max-w-md gap-3 text-left">
              <textarea
                rows={3}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="თქვენი სურვილი..."
                className="w-full rounded-lg border border-ink/15 bg-parchment px-4 py-3 font-geo text-sm text-ink outline-none focus:border-wine"
              />
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="თქვენი სახელი"
                className="w-full rounded-lg border border-ink/15 bg-parchment px-4 py-3 font-geo text-sm text-ink outline-none focus:border-wine"
              />
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => void handleSendClick()}
                  className="rounded-full bg-wine px-7 py-2.5 font-geo text-xs tracking-[0.2em] text-parchment transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "იგზავნება..." : "ჩაწერა"}
                </button>
                <button
                  type="button"
                  onClick={() => setWriting(false)}
                  className="rounded-full border border-ink/20 px-7 py-2.5 font-geo text-xs tracking-[0.2em] text-ink/70 transition hover:bg-ink/5"
                >
                  გაუქმება
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setWriting(true)}
              className="inline-flex items-center gap-2 rounded-full border border-parchment/40 px-7 py-2.5 font-geo text-xs tracking-[0.2em] text-parchment transition hover:bg-wine hover:text-parchment hover:border-wine"
            >
              <PenLine className="h-4 w-4" strokeWidth={1.5} />
              სურვილის დაწერა
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function PageFace({ side, entry }: { side: "left" | "right"; entry: Entry | undefined }) {
  return (
    <div className={`book-page ${side}`}>
      <PageBody entry={entry} />
    </div>
  );
}

function PageBody({ entry }: { entry: Entry | undefined }) {
  if (!entry) return <span className="book-empty" aria-hidden />;
  return (
    <>
      <p className="font-script text-[clamp(1rem,2.4vw,1.35rem)] leading-relaxed text-ink/85">
        “{entry.text}”
      </p>
      <p className="mt-4 font-script text-lg text-wine">— {entry.name}</p>
    </>
  );
}
