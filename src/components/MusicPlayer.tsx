import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const MUSIC_SRC = "/audio/vampire-weekend-step.mp3";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.45;

    const playOnFirstGesture = (event: Event) => {
      if (event.target instanceof Element && event.target.closest("[data-music-control]")) {
        cleanup();
        return;
      }
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
      cleanup();
    };

    const events: (keyof WindowEventMap)[] = ["pointerdown", "touchstart", "keydown"];
    const cleanup = () => {
      events.forEach((event) => window.removeEventListener(event, playOnFirstGesture));
    };
    events.forEach((event) =>
      window.addEventListener(event, playOnFirstGesture, { once: true, passive: true }),
    );

    return () => {
      cleanup();
      audio.pause();
    };
  }, []);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      await audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }

  return (
    <>
      <audio ref={audioRef} src={MUSIC_SRC} preload="auto" loop aria-hidden="true" />

      <button
        type="button"
        data-music-control
        onClick={() => void toggle()}
        aria-label={playing ? "მუსიკის გამორთვა" : "მუსიკის ჩართვა"}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-parchment/30 bg-wine/95 text-parchment shadow-soft backdrop-blur transition hover:scale-105 hover:bg-wine sm:h-14 sm:w-14"
      >
        {playing ? (
          <Volume2 className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <VolumeX className="h-5 w-5" strokeWidth={1.5} />
        )}
        {playing && (
          <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-parchment/40" />
        )}
      </button>
    </>
  );
}
