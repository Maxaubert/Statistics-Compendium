import { Link } from "react-router-dom";
import { Calculator, ChevronRight, Compass } from "lucide-react";
import { Banner } from "@/components/shell/Banner";

interface HelpCard {
  to: string;
  title: string;
  blurb: string;
  Icon: typeof Calculator;
}

const HELP_CARDS: HelpCard[] = [
  {
    to: "/hjelp/kalkulator",
    title: "Kalkulator",
    blurb:
      "Den flytende kalkulatoren, hvilke uttrykk den støtter, hurtigtaster og persistens.",
    Icon: Calculator,
  },
  {
    to: "/hjelp/vanskelige-oppgaver",
    title: "Vanskelige oppgaver",
    blurb:
      "Kurert liste over vriende deloppgaver fra tidligere eksamener — med løsningsskisser og lenker til riktig formelside.",
    Icon: Compass,
  },
];

export function HelpIndex() {
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="relative min-h-[calc(100vh-100px)] overflow-hidden bg-card px-12 py-8">
        <LighthouseArt />
        <div className="relative z-10">
          <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
            Hjelp
          </h1>
          <p className="mb-5 font-serif italic text-ink-3">
            Korte forklaringer på hvordan du bruker funksjonene i kompendiet.
          </p>
          <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
            {HELP_CARDS.map((card) => (
              <li key={card.to} className="m-0">
                <Link
                  to={card.to}
                  className="group flex h-full items-start gap-3 rounded-lg border border-line bg-card px-5 py-4 no-underline transition-colors hover:border-primary-2/50 hover:bg-primary-soft/40"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-line bg-paper-2 text-primary-2"
                  >
                    <card.Icon size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5 font-serif text-[16px] font-semibold text-ink">
                      {card.title}
                      <ChevronRight
                        size={14}
                        className="text-ink-3 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-2"
                      />
                    </span>
                    <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-2">
                      {card.blurb}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

/**
 * Decorative lighthouse + light-cone artwork that fills the empty
 * space below the help cards. Indigo line-art with a soft cyan beam
 * sweeping left from the lamp; faint waves and birds set the scene.
 * Pure SVG, sliced to the right side via preserveAspectRatio so the
 * lighthouse always sits in the lower-right corner regardless of
 * viewport width.
 */
function LighthouseArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full"
      >
        <defs>
          <radialGradient
            id="hjelpCone"
            cx="0.95"
            cy="0.45"
            r="0.85"
            fx="0.95"
            fy="0.45"
          >
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
            <stop offset="35%" stopColor="#22d3ee" stopOpacity="0.30" />
            <stop offset="70%" stopColor="#6366f1" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hjelpLamp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cffafe" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>

        {/* light cone fanning from the lamp leftward */}
        <path
          d="M 1410 600 L 200 460 L 60 720 L 1410 612 Z"
          fill="url(#hjelpCone)"
          opacity="0.95"
        />

        {/* soft halo around the lamp */}
        <circle cx="1410" cy="600" r="80" fill="#22d3ee" opacity="0.12" />
        <circle cx="1410" cy="600" r="40" fill="#22d3ee" opacity="0.16" />

        {/* waves at the base – three rows at varying opacity for depth */}
        <g
          stroke="#6366f1"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        >
          <path d="M 80 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
          <path d="M 280 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
          <path d="M 480 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
          <path d="M 680 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
          <path d="M 880 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0 t 28 0" />
          <path d="M 1080 770 q 14 -10 28 0 t 28 0 t 28 0 t 28 0" />
        </g>
        <g
          stroke="#6366f1"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
          opacity="0.5"
        >
          <path d="M 160 800 q 12 -8 24 0 t 24 0 t 24 0 t 24 0" />
          <path d="M 380 800 q 12 -8 24 0 t 24 0 t 24 0 t 24 0" />
          <path d="M 600 800 q 12 -8 24 0 t 24 0 t 24 0 t 24 0" />
          <path d="M 820 800 q 12 -8 24 0 t 24 0 t 24 0 t 24 0" />
          <path d="M 1040 800 q 12 -8 24 0 t 24 0 t 24 0 t 24 0" />
          <path d="M 1240 800 q 12 -8 24 0 t 24 0 t 24 0" />
        </g>
        <g
          stroke="#6366f1"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          opacity="0.35"
        >
          <path d="M 100 830 q 10 -6 20 0 t 20 0 t 20 0 t 20 0" />
          <path d="M 320 830 q 10 -6 20 0 t 20 0 t 20 0" />
          <path d="M 540 830 q 10 -6 20 0 t 20 0 t 20 0 t 20 0" />
          <path d="M 760 830 q 10 -6 20 0 t 20 0 t 20 0" />
          <path d="M 980 830 q 10 -6 20 0 t 20 0 t 20 0 t 20 0" />
          <path d="M 1200 830 q 10 -6 20 0 t 20 0 t 20 0" />
        </g>

        {/* drifting birds in the lit area */}
        <g
          stroke="#4338ca"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        >
          <path d="M 720 420 q 8 -8 16 0 q 8 -8 16 0" />
          <path d="M 920 360 q 6 -6 12 0 q 6 -6 12 0" />
          <path d="M 540 480 q 7 -7 14 0 q 7 -7 14 0" />
        </g>

        {/* lighthouse, anchored bottom-right */}
        <g
          transform="translate(1390 600)"
          stroke="#4338ca"
          strokeWidth="2.2"
          fill="#ffffff"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* rocky base */}
          <path
            d="M -90 200 Q -50 178, 0 180 Q 60 182, 100 200 L 100 220 L -90 220 Z"
            fill="#eef2ff"
            stroke="#4338ca"
            strokeWidth="1.5"
          />
          {/* tower body */}
          <path d="M -34 180 L -22 30 L 22 30 L 34 180 Z" fill="#ffffff" />
          {/* horizontal bands */}
          <line x1="-30" y1="80" x2="30" y2="80" stroke="#4338ca" strokeWidth="1.2" />
          <line x1="-32" y1="130" x2="32" y2="130" stroke="#4338ca" strokeWidth="1.2" />
          {/* door */}
          <path
            d="M -8 180 L -8 158 Q -8 150, 0 150 Q 8 150, 8 158 L 8 180 Z"
            fill="#eef2ff"
            stroke="#4338ca"
            strokeWidth="1.2"
          />
          {/* gallery walkway */}
          <rect x="-32" y="20" width="64" height="10" fill="#ffffff" />
          {/* lamp room glass */}
          <rect
            x="-22"
            y="-14"
            width="44"
            height="34"
            fill="#cffafe"
            stroke="#4338ca"
            strokeWidth="1.6"
          />
          <line x1="-10" y1="-14" x2="-10" y2="20" stroke="#4338ca" strokeWidth="0.8" />
          <line x1="10" y1="-14" x2="10" y2="20" stroke="#4338ca" strokeWidth="0.8" />
          {/* lamp */}
          <circle cx="0" cy="0" r="6" fill="url(#hjelpLamp)" stroke="#0e7490" strokeWidth="1" />
          {/* roof */}
          <path d="M -26 -14 L 0 -36 L 26 -14 Z" fill="#ffffff" />
          {/* spire and cyan tip */}
          <line x1="0" y1="-36" x2="0" y2="-52" stroke="#4338ca" strokeWidth="1.6" />
          <circle cx="0" cy="-54" r="2" fill="#22d3ee" stroke="none" />
        </g>

        {/* faint horizon line */}
        <line
          x1="0"
          y1="540"
          x2="1600"
          y2="540"
          stroke="#e7e5e4"
          strokeWidth="1"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
