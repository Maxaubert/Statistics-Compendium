import { Link } from "react-router-dom";
import { Calculator, ChevronRight } from "lucide-react";
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
];

export function HelpIndex() {
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-12 py-8">
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
      </main>
    </div>
  );
}
