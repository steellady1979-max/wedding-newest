import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Lock, LogOut, RefreshCw } from "lucide-react";
import { getRsvps, lockAdmin, unlockAdmin, type RsvpRow } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "ადმინი — გიგა & ნინი RSVP & სურვილები" },
      { name: "description", content: "დახურული გვერდი ქორწილის მონაცემების სანახავად." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "ადმინი — RSVP & სურვილები" },
      { property: "og:description", content: "დახურული გვერდი ქორწილის მონაცემების სანახავად." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

type WishRow = {
  id: string;
  full_name: string;
  message: string;
  created_at: string;
};

function Admin() {
  const load = useServerFn(getRsvps);
  const unlock = useServerFn(unlockAdmin);
  const lock = useServerFn(lockAdmin);

  const [rows, setRows] = useState<RsvpRow[] | null>(null);
  const [wishes, setWishes] = useState<WishRow[]>([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const res = await load({ data: undefined });
      setRows(res.locked ? null : res.rows);

      if (!res.locked) {
        const { data: wishesData } = await supabase
          .from("wishes")
          .select("id, full_name, message, created_at")
          .order("created_at", { ascending: false });
        
        if (wishesData) {
          setWishes(wishesData);
        }
      }
    } finally {
      setBusy(false);
    }
  }, [load]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const res = await unlock({ data: { password } });
    setBusy(false);
    if (!res.ok) {
      setError("პაროლი არასწორია");
      return;
    }
    setPassword("");
    void refresh();
  }

  const exportToExcel = () => {
    let csvContent = "\uFEFFკატეგორია,სახელი / ავტორი,სტატუსი / მილოცვა, +1 პერსონა, თარიღი\n";

    if (rows) {
      rows.forEach((r) => {
        const category = r.attending ? "მოდის" : "ვერ მოდის";
        const name = `"${(r.full_name || "").replace(/"/g, '""')}"`;
        const status = r.attending ? "დიახ" : "არა";
        const plusOne = `"${(r.plus_one_name || "-").replace(/"/g, '""')}"`;
        const date = `"${new Date(r.created_at).toLocaleDateString("ka-GE")}"`;

        csvContent += `"${category}",${name},${status},${plusOne},${date}\n`;
      });
    }

    wishes.forEach((w) => {
      const category = "სურვილი";
      const name = `"${(w.full_name || "").replace(/"/g, '""')}"`;
      const message = `"${(w.message || "").replace(/"/g, '""')}"`;
      const date = `"${new Date(w.created_at).toLocaleDateString("ka-GE")}"`;

      csvContent += `"${category}",${name},${message},-,${date}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Giga_Nini_Guests_Wishes_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (rows === null) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-backdrop px-6">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-2xl border border-ink/10 bg-parchment/95 p-8 shadow-soft"
        >
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-wine" strokeWidth={1.5} />
            <h1 className="font-geo text-lg tracking-[0.15em] text-ink">ადმინი</h1>
          </div>
          <label htmlFor="pw" className="mt-6 block font-geo text-xs tracking-[0.2em] text-ink/60">
            პაროლი
          </label>
          <input
            id="pw"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-parchment px-4 py-3 font-geo text-sm text-ink outline-none focus:border-wine"
          />
          {error && <p className="mt-2 font-geo text-xs text-wine">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="mt-5 w-full rounded-full bg-wine px-8 py-3 font-geo text-sm tracking-[0.2em] text-parchment transition hover:opacity-90 disabled:opacity-60"
          >
            შესვლა
          </button>
        </form>
      </main>
    );
  }

  const yes = rows.filter((r) => r.attending);
  const no = rows.filter((r) => !r.attending);
  const plusOnes = yes.filter((r) => r.plus_one_name && r.plus_one_name.trim().length > 0);
  const totalGuests = yes.length + plusOnes.length;

  return (
    <main className="min-h-screen bg-backdrop px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <p className="font-geo text-[0.65rem] tracking-[0.3em] text-ink/45">ADMIN</p>
            <h1 className="mt-1 font-geo text-2xl tracking-[0.12em] text-ink sm:text-3xl">
              პანელი & სურვილები
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-2 rounded-full bg-wine px-4 py-2 font-geo text-xs tracking-[0.15em] text-parchment transition hover:opacity-90 shadow-sm"
            >
              📊 ექსელში გადმოწერა
            </button>
            <button
              onClick={() => void refresh()}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full border border-wine/25 px-4 py-2 font-geo text-xs tracking-[0.15em] text-wine transition hover:bg-wine hover:text-parchment disabled:opacity-60"
            >
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={1.5} />
              განახლება
            </button>
            <button
              onClick={async () => {
                await lock({ data: undefined });
                setRows(null);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 font-geo text-xs tracking-[0.15em] text-ink/70 transition hover:bg-ink/5"
            >
              <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
              გასვლა
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <Stat label="სულ სტუმარი" value={totalGuests} />
          <Stat label="მოდის" value={yes.length} />
          <Stat label="+1" value={plusOnes.length} />
          <Stat label="სურვილები" value={wishes.length} />
        </div>

        <Table title="მოდის" rows={yes} />
        <Table title="ვერ მოდის" rows={no} />
        
        {/* სურვილების ცხრილი ადმინ-პანელისთვის */}
        <WishesTable title="სტუმრების სურვილები" wishes={wishes} />
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-gradient-to-b from-parchment to-parchment/80 p-5 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <p className="font-geo text-3xl text-wine sm:text-4xl">{value}</p>
      <p className="mt-1.5 font-geo text-[0.6rem] tracking-[0.22em] text-ink/55 uppercase">{label}</p>
    </div>
  );
}

function Table({ title, rows }: { title: string; rows: RsvpRow[] }) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-parchment/95 shadow-soft">
      <h2 className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.03] px-5 py-4 font-geo text-sm tracking-[0.2em] text-ink/70">
        <span>{title}</span>
        <span className="rounded-full bg-wine/10 px-3 py-1 text-[0.7rem] tracking-[0.1em] text-wine">
          {rows.length}
        </span>
      </h2>
      {rows.length === 0 ? (
        <p className="px-5 py-6 font-geo text-sm text-ink/50">ჯერ არავინ</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-geo text-sm text-ink/85">
            <thead>
              <tr className="border-b border-ink/10 text-[0.65rem] tracking-[0.2em] text-ink/50">
                <th className="px-5 py-3">სახელი და გვარი</th>
                <th className="px-5 py-3">+1</th>
                <th className="px-5 py-3">თარიღი</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-ink/5 transition last:border-0 odd:bg-ink/[0.015] hover:bg-wine/5"
                >
                  <td className="px-5 py-3.5 font-medium text-ink">{r.full_name}</td>
                  <td className="px-5 py-3 text-ink/70">{r.plus_one_name || "—"}</td>
                  <td className="px-5 py-3 text-ink/50">
                    {new Date(r.created_at).toLocaleDateString("ka-GE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function WishesTable({ title, wishes }: { title: string; wishes: WishRow[] }) {
  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-ink/10 bg-parchment/95 shadow-soft">
      <h2 className="flex items-center justify-between gap-3 border-b border-ink/10 bg-ink/[0.03] px-5 py-4 font-geo text-sm tracking-[0.2em] text-ink/70">
        <span>{title}</span>
        <span className="rounded-full bg-wine/10 px-3 py-1 text-[0.7rem] tracking-[0.1em] text-wine">
          {wishes.length}
        </span>
      </h2>
      {wishes.length === 0 ? (
        <p className="px-5 py-6 font-geo text-sm text-ink/50">ჯერ სურვილები არ არის</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left font-geo text-sm text-ink/85">
            <thead>
              <tr className="border-b border-ink/10 text-[0.65rem] tracking-[0.2em] text-ink/50">
                <th className="px-5 py-3">ავტორი</th>
                <th className="px-5 py-3">სურვილი / მილოცვა</th>
                <th className="px-5 py-3">თარიღი</th>
              </tr>
            </thead>
            <tbody>
              {wishes.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-ink/5 transition last:border-0 odd:bg-ink/[0.015] hover:bg-wine/5"
                >
                  <td className="px-5 py-3 font-semibold text-wine">{w.full_name}</td>
                  <td className="px-5 py-3 text-ink/90 italic">“{w.message}”</td>
                  <td className="px-5 py-3 text-ink/50 text-xs">
                    {new Date(w.created_at).toLocaleDateString("ka-GE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
