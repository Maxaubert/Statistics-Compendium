import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Check, Keyboard, Palette, Save, Sigma } from "lucide-react";
import { Banner } from "@/components/shell/Banner";
import {
  CALCULATOR_STYLES,
  useCalculatorStyle,
  type CalculatorStyleConfig,
  type CalculatorStyleId,
} from "@/components/calculator/calculator-style";

export function HelpCalculator() {
  return (
    <div className="min-h-screen bg-paper">
      <Banner />
      <main className="bg-card px-12 py-8">
        <Link
          to="/hjelp"
          className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-ink-2 no-underline hover:text-primary-2"
        >
          <ArrowLeft size={14} /> Tilbake til Hjelp
        </Link>

        <h1 className="m-0 mb-2 font-serif text-[36px] font-semibold text-ink">
          Kalkulator
        </h1>
        <p className="mb-8 font-serif italic text-ink-3">
          En flytende, alltid tilgjengelig uttrykksevaluator. Skriv hva du
          vil regne, få svaret med én gang.
        </p>

        <Section icon={Palette} title="Stil">
          <p>
            Velg hvordan kalkulator-panelet ser ut. Standard er mørk monokrom; akrylglass-varianten har bakgrunnsuskarphet og en regnbue-stripe på toppen.
          </p>
          <StylePicker />
        </Section>

        <Section icon={Keyboard} title="Slik åpner og lukker du den">
          <p>
            Knappen i nedre høyre hjørne åpner og lukker kalkulatoren. Du kan
            også bruke hurtigtasten <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> (eller{" "}
            <Kbd>⌘</Kbd> + <Kbd>K</Kbd> på Mac) hvor som helst på siden.
          </p>
          <p>
            Lukk med <Kbd>Esc</Kbd>, ved å klikke utenfor panelet, eller med
            kryss-knappen i hjørnet.
          </p>
        </Section>

        <Section icon={Sigma} title="Hva du kan skrive">
          <p>
            Kalkulatoren er en uttrykksevaluator (<Kbd>mathjs</Kbd>) — ikke et
            programmeringsspråk. Den støtter:
          </p>
          <ul>
            <li>
              <strong>Aritmetikk:</strong> <Code>+ − · / ^ %</Code>
            </li>
            <li>
              <strong>Funksjoner:</strong> <Code>sqrt</Code>, <Code>log</Code>,{" "}
              <Code>sin</Code>, <Code>cos</Code>, <Code>factorial(5)</Code>,{" "}
              <Code>combinations(10, 3)</Code>
            </li>
            <li>
              <strong>Snarvei for binomialkoeffisient:</strong>{" "}
              <Code>C(n, k)</Code> tolkes som <Code>combinations(n, k)</Code>.
              Eksempel: <Code>C(10, 3)</Code> → <Code>120</Code>.
            </li>
            <li>
              <strong>Naturlig logaritme:</strong> <Code>ln(x)</Code>{" "}
              fungerer som forventet. Eksempel:{" "}
              <Code>ln(0.05) / ln(0.7)</Code> → <Code>8.396…</Code>.
            </li>
            <li>
              <strong>Tilordning:</strong> <Code>x = 5</Code>, så{" "}
              <Code>x^2 + 1</Code>
            </li>
            <li>
              <strong>Statistikk:</strong> <Code>mean([1,2,3])</Code>,{" "}
              <Code>std([1,2,3])</Code>
            </li>
            <li>
              <strong>Unicode-snarveier:</strong> <Code>√</Code>, <Code>π</Code>
              , <Code>÷</Code>, <Code>×</Code>, <Code>−</Code> tolkes
              automatisk.
            </li>
          </ul>
          <p className="text-ink-2">
            Eksempel:{" "}
            <Code>combinations(10, 3) · 0.4^3 · 0.6^7</Code> regner ut binomial
            sannsynlighet direkte.
          </p>
        </Section>

        <Section icon={Save} title="Husker uttrykket ditt">
          <p>
            Det du skrev sist blir lagret lokalt i nettleseren, så det ligger
            der du forlot det neste gang du åpner panelet — også etter sidebytte
            eller refresh.
          </p>
        </Section>
      </main>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Calculator;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-lg border border-line bg-card px-6 py-5">
      <h2 className="m-0 mb-3 flex items-center gap-2 font-serif text-[18px] font-semibold text-ink">
        <Icon size={16} className="text-primary-2" />
        {title}
      </h2>
      <div className="prose-reset text-[14.5px] leading-relaxed text-ink-2 [&_p]:my-2 [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-1">
        {children}
      </div>
    </section>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-block rounded border border-line bg-paper-2 px-1.5 py-px font-mono text-[12px] text-ink shadow-[0_1px_0_rgba(0,0,0,0.05)]">
      {children}
    </kbd>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded border border-line bg-paper-2 px-1 py-px font-mono text-[12.5px] text-ink">
      {children}
    </code>
  );
}

/**
 * Two-up grid of clickable style preview cards. The selected style
 * gets an indigo ring + a check badge in the corner. Clicking a card
 * persists the choice via the shared useCalculatorStyle hook, which
 * the live calculator widget listens to and re-skins instantly.
 */
function StylePicker() {
  const [activeId, setActiveId] = useCalculatorStyle();
  const ids = Object.keys(CALCULATOR_STYLES) as CalculatorStyleId[];
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {ids.map((id) => {
        const config = CALCULATOR_STYLES[id];
        const selected = activeId === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setActiveId(id)}
            aria-pressed={selected}
            className={
              "group relative flex w-[290px] flex-col gap-2.5 rounded-lg border bg-card p-2.5 text-left transition-all " +
              (selected
                ? "border-primary-2 shadow-[0_0_0_3px_rgba(99,102,241,0.18)]"
                : "border-line hover:border-primary-3/60 hover:shadow-sm")
            }
          >
            <StylePreviewPanel config={config} />
            <div className="px-0.5">
              <div className="flex items-center justify-between">
                <span className="font-serif text-[13.5px] font-semibold text-ink">
                  {config.label}
                  {id === "monochrome" && (
                    <span className="ml-1 text-[10.5px] font-normal text-ink-3">
                      · standard
                    </span>
                  )}
                </span>
                {selected && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-2 text-white">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-ink-2">
                {config.description}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Compact rendering of the calculator panel using a given style config,
 * shown over the same backdrop the live widget uses, so the preview
 * matches what you'll see on the page. Outer wrapper paints the
 * backdrop; the panel sits centered inside with a small margin so the
 * acrylic blur picks up the colored gradient behind it.
 */
function StylePreviewPanel({ config }: { config: CalculatorStyleConfig }) {
  return (
    <div
      className="relative overflow-hidden rounded-md"
      style={{ ...config.backdrop, padding: "14px 12px" }}
    >
      <div
        className="relative overflow-hidden rounded-[10px]"
        style={config.panel}
      >
        {config.topAccent && (
          <div
            aria-hidden
            className="absolute left-0 right-0 top-0"
            style={{
              height: `${config.topAccent.height}px`,
              background: config.topAccent.gradient,
              boxShadow: config.topAccent.glow,
              zIndex: 1,
            }}
          />
        )}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: config.headerDivider }}
        >
          <span
            className="font-mono text-[8px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: config.headerInk }}
          >
            Kalkulator
          </span>
          <span style={{ color: config.closeRest, fontSize: 11 }}>×</span>
        </div>
        <div className="flex flex-col gap-1.5 px-3 py-2.5">
          <div
            className="rounded-md px-2 py-1.5 font-mono text-[10px]"
            style={{ ...config.inputRow, color: config.inputInk }}
          >
            1 − 0.7^9
          </div>
          <div
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 font-mono text-[10px]"
            style={config.resultRow}
          >
            <span style={{ color: config.resultEq, fontWeight: 700 }}>=</span>
            <span style={{ color: config.resultValueInk, fontWeight: 700 }}>
              0.960
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
