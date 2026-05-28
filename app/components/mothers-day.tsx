"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type Step = "intro" | "date-question" | "day-selection" | "confirmation";

interface Heart {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
}

const INTRO_LINES = [
  "Glad mors dag, Elektra!",
  "Du är en av mina favoritmammor",
  "Och den snyggaste, sexigaste och roligaste mamman jag vet",
  "Och jag undrade...",
];

export default function MothersDay() {
  const [step, setStep] = useState<Step>("intro");
  const [visibleLines, setVisibleLines] = useState(0);
  const [chosenDay, setChosenDay] = useState("");
  const [hearts, setHearts] = useState<Heart[]>([]);

  // Nej state
  const nejRef = useRef<HTMLButtonElement>(null);
  const [nejEscaped, setNejEscaped] = useState(false);
  const [nejPos, setNejPos] = useState({ x: 0, y: 0 });
  const [nejSize, setNejSize] = useState({ w: 0, h: 0 });
  const [nejBroken, setNejBroken] = useState(false);
  const [nejGone, setNejGone] = useState(false);
  const [nejFlashed, setNejFlashed] = useState(false);
  const nejClickCount = useRef(0); // useRef = always current in handler, no stale closure

  useEffect(() => {
    if (step === "date-question") {
      setNejEscaped(false);
      setNejBroken(false);
      setNejGone(false);
      setNejFlashed(false);
      nejClickCount.current = 0;
    }
  }, [step]);

  useEffect(() => {
    if (!nejGone) return;
    const t = setTimeout(() => setNejFlashed(true), 2000);
    return () => clearTimeout(t);
  }, [nejGone]);

  // Step 1: fade in lines
  useEffect(() => {
    if (step !== "intro") return;
    const timers = [
      setTimeout(() => setVisibleLines(1), 600),
      setTimeout(() => setVisibleLines(2), 2200),
      setTimeout(() => setVisibleLines(3), 3800),
      setTimeout(() => setVisibleLines(4), 5400),
      setTimeout(() => setStep("date-question"), 9900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [step]);

  // Step 4: hearts
  useEffect(() => {
    if (step !== "confirmation") return;
    setHearts(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: 2 + Math.random() * 96,
        delay: Math.random() * 3.5,
        size: 18 + Math.random() * 26,
        duration: 3.5 + Math.random() * 2.5,
      })),
    );
  }, [step]);

  const randomNejTarget = () => ({
    x: 60 + Math.random() * (window.innerWidth - 120),
    y: 60 + Math.random() * (window.innerHeight - 120),
  });

  const offScreenTarget = () => {
    const edge = Math.floor(Math.random() * 4);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    if (edge === 0) return { x: -300, y: cy };
    if (edge === 1) return { x: window.innerWidth + 300, y: cy };
    if (edge === 2) return { x: cx, y: -300 };
    return { x: cx, y: window.innerHeight + 300 };
  };

  const handleNejClick = () => {
    if (nejBroken) return;

    nejClickCount.current += 1;

    if (nejClickCount.current >= 5) {
      setNejBroken(true);
      setNejPos(offScreenTarget());
      setTimeout(() => setNejGone(true), 650);
      return;
    }

    if (!nejEscaped) {
      if (!nejRef.current) return;
      const rect = nejRef.current.getBoundingClientRect();
      // Batch: snap to fixed at current position. React 19 batches these automatically.
      setNejSize({ w: rect.width, h: rect.height });
      setNejPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      setNejEscaped(true);
      // rAF fires after the batch render — transition animates from snap → random
      requestAnimationFrame(() => setNejPos(randomNejTarget()));
    } else {
      setNejPos(randomNejTarget());
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Step 1 */}
      {step === "intro" && (
        <div className="flex flex-col items-center gap-5 text-center max-w-sm">
          {INTRO_LINES.map((line, i) => (
            <div
              key={i}
              className="bg-pink-300 border-2 border-black shadow-[4px_4px_0px_0px_#000] px-5 py-3 transition-all duration-700"
              style={{
                opacity: visibleLines > i ? 1 : 0,
                transform:
                  visibleLines > i ? "translateY(0)" : "translateY(14px)",
              }}
            >
              <p className="text-xl font-black text-black leading-snug">
                {line}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Step 2 */}
      {step === "date-question" && (
        <div className="flex flex-col items-center gap-8">
          <ChatBubble key={nejGone && !nejFlashed ? "broken" : "normal"}>
            {nejGone && !nejFlashed
              ? "Hm.. Nejknappen flydde..?"
              : "Vill du gå på dejt med mig nästa helg?"}
          </ChatBubble>

          <div className="flex gap-4 items-center">
            <button
              onClick={() => setStep("day-selection")}
              className="bg-pink-400 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 font-black text-black text-lg px-10 py-3 transition-all duration-75 cursor-pointer"
            >
              Ja
            </button>

            {nejEscaped && (
              <div
                style={{ width: nejSize.w, height: nejSize.h, flexShrink: 0 }}
              />
            )}

            {/* Wrapper: fixed positioning. Separated to avoid transform conflict. */}
            {!nejGone && (
              <div
                style={
                  nejEscaped
                    ? {
                        position: "fixed",
                        left: nejPos.x,
                        top: nejPos.y,
                        transform: "translate(-50%, -50%)",
                        transition: nejBroken
                          ? "left 0.5s ease-in, top 0.5s ease-in"
                          : "left 0.22s cubic-bezier(0.4, 0, 1, 1), top 0.22s cubic-bezier(0.4, 0, 1, 1)",
                        zIndex: 50,
                      }
                    : { display: "contents" }
                }
              >
                <button
                  ref={nejRef}
                  onClick={handleNejClick}
                  className="bg-pink-400 border-2 border-black shadow-[4px_4px_0px_0px_#000] font-black text-black text-lg px-8 py-3 cursor-pointer select-none"
                >
                  Nej
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === "day-selection" && (
        <div className="flex flex-col items-center gap-8">
          <ChatBubble>Vilken dag vill du gå på dejt?</ChatBubble>
          <div className="flex gap-4">
            {["Fredag", "Lördag"].map((day) => (
              <button
                key={day}
                onClick={() => {
                  setChosenDay(day);
                  setStep("confirmation");
                }}
                className="bg-pink-400 border-2 border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-none active:translate-x-1 active:translate-y-1 font-black text-black text-lg px-8 py-3 transition-all duration-75 cursor-pointer"
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4 */}
      {step === "confirmation" && (
        <>
          {hearts.map((h) => (
            <span
              key={h.id}
              className="fixed pointer-events-none animate-float-heart"
              style={{
                left: `${h.x}%`,
                bottom: "-80px",
                fontSize: `${h.size}px`,
                animationDelay: `${h.delay}s`,
                animationDuration: `${h.duration}s`,
              }}
            >
              🩷
            </span>
          ))}
          <div className="fixed bottom-0 left-0 right-0 flex justify-between items-end pointer-events-none z-0 translate-y-8">
            <Image
              src="/uffe.png"
              alt="uffe"
              width={180}
              height={180}
              className="object-contain animate-swing"
            />
            <Image
              src="/e.png"
              alt="e"
              width={180}
              height={180}
              className="object-contain animate-swing"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
          <div className="animate-bubble-pop animate-wobble bg-yellow-300 border-2 border-black shadow-[6px_6px_0px_0px_#000] px-10 py-8 max-w-xs text-center z-10 flex flex-col items-center gap-5">
            <p className="text-2xl font-black text-black leading-snug">
              Ses på {chosenDay}, <br /> jag älskar dig!
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ChatBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-bubble-pop relative bg-white border-2 border-black shadow-[4px_4px_0px_0px_#000] px-7 py-5 max-w-xs text-center">
      <p className="text-xl font-black text-black leading-snug">{children}</p>
      {/* Bordered tail: outer black triangle, inner white on top */}
      <span
        className="absolute left-6 w-0 h-0"
        style={{
          bottom: "-15px",
          borderLeft: "11px solid transparent",
          borderRight: "11px solid transparent",
          borderTop: "15px solid black",
        }}
      />
      <span
        className="absolute left-6.25 w-0 h-0"
        style={{
          bottom: "-12px",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: "13px solid white",
        }}
      />
    </div>
  );
}
