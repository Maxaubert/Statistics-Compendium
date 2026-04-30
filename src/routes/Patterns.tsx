import { Link } from "react-router-dom";
import { Banner } from "@/components/shell/Banner";
import { loadAllContent } from "@/data/loadContent";

export function Patterns() {
  const { patterns } = loadAllContent();
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="mx-auto max-w-[920px] bg-card px-14 py-8">
        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Oppgavemønstre
        </h1>
        <p className="mb-6 font-serif italic text-ink-3">
          Vanlige oppgavetyper med fast prosedyre og lenker til relevante
          formler. Når du gjenkjenner mønsteret, slipper du å lete etter
          formelen — du vet hvilken side du skal til.
        </p>
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {patterns.map((p) => (
            <li key={p.id}>
              <Link
                to={`/monstre/${p.id}`}
                className="block rounded-lg border border-line bg-paper-2 px-5 py-4 no-underline hover:border-primary-2"
              >
                <div className="font-serif text-[16px] font-semibold text-ink">
                  {p.name_no}
                </div>
                <div className="mt-1 text-[13px] italic text-ink-3">
                  {p.cue}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
