import { Link } from "react-router-dom";
import type { OversiktForm } from "@/data/schema";
import { useGlossaryPopup } from "./GlossaryPopup";
import { renderCombiningMarks } from "./inline-code";

export interface OversiktCardGridProps {
  forms: OversiktForm[];
}

/**
 * Card grid for the variance/stdev/expected-value overview pages.
 * Each card represents one variance form (or related concept).
 *
 * Click anywhere on the card -> opens glossary popup for `glossary_id`.
 * Click on an entry-link inside the card -> navigates to that entry
 * (the link `stopPropagation`s so the card click doesn't fire).
 */
export function OversiktCardGrid({ forms }: OversiktCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {forms.map((form, i) => (
        <OversiktCard key={i} form={form} />
      ))}
    </div>
  );
}

function OversiktCard({ form }: { form: OversiktForm }) {
  const popup = useGlossaryPopup();
  const clickable = Boolean(form.glossary_id && popup);

  const handleClick = () => {
    if (form.glossary_id && popup) popup.openTerm(form.glossary_id);
  };

  return (
    <article
      onClick={clickable ? handleClick : undefined}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      className={[
        "rounded-xl border border-line bg-card p-6 transition-all",
        clickable
          ? "cursor-pointer hover:border-primary-3 hover:shadow-[0_4px_12px_rgba(67,56,202,.08)]"
          : "",
      ].join(" ")}
    >
      <div className="mb-3.5 flex items-baseline justify-between gap-4">
        <h3 className="m-0 font-serif text-[19px] font-semibold text-ink">
          {form.title}
        </h3>
        {form.symbol && (
          <span className="rounded bg-primary-soft px-2 py-0.5 font-mono text-[12px] text-primary-2">
            {form.symbol}
          </span>
        )}
      </div>

      <pre className="mb-3.5 overflow-x-auto rounded-lg border border-calc-border bg-calc-bg px-[18px] py-4 font-mono text-[14.5px] leading-snug text-calc-text">
        {renderCombiningMarks(form.formula)}
      </pre>

      {form.description && (
        <p className="m-0 mb-3 font-serif text-[14.5px] leading-relaxed text-ink-2">
          {renderCombiningMarks(form.description)}
        </p>
      )}

      {form.entry_links && form.entry_links.length > 0 && (
        <div className="flex flex-wrap gap-3 text-[13px]">
          {form.entry_links.map((link, i) => (
            <Link
              key={i}
              to={`/entry/${link.id}`}
              onClick={(e) => e.stopPropagation()}
              className="border-b border-dashed border-primary-3 text-primary-2 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </article>
  );
}
