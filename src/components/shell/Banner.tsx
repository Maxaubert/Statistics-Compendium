import { Moon, Sun, Compass, BookA, Sigma, Table2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

interface NavLink {
  to: string;
  label: string;
  Icon: typeof Compass;
  /** When set, this link is "current" only if /?tab=<value> matches. */
  tabParam?: string;
}

const CATEGORY_LINKS: NavLink[] = [
  { to: "/", label: "Formler og konsepter", Icon: Sigma, tabParam: "formler" },
  { to: "/ordliste", label: "Ordliste", Icon: BookA },
  { to: "/?tab=tabeller", label: "Tabeller", Icon: Table2, tabParam: "tabeller" },
];

const HELPER_LINKS: NavLink[] = [
  { to: "/veiviser", label: "Veiviser", Icon: Compass },
];

function isActive(loc: ReturnType<typeof useLocation>, link: NavLink): boolean {
  if (link.tabParam !== undefined) {
    if (loc.pathname !== "/") return false;
    const params = new URLSearchParams(loc.search);
    const tab = params.get("tab") ?? "formler";
    return tab === link.tabParam;
  }
  return loc.pathname === link.to;
}

export function Banner() {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const Icon = theme === "light" ? Moon : Sun;
  const allLinks = [...CATEGORY_LINKS, ...HELPER_LINKS];
  return (
    <header
      className="relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)",
      }}
    >
      <div
        className="absolute -right-10 -top-10 h-[220px] w-[220px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(34, 211, 238, 0.18) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      <div className="relative z-10 flex items-center justify-between px-7 py-4">
        <Link
          to="/"
          aria-label="Til forsiden"
          className="flex items-center gap-3 text-white no-underline transition-opacity hover:opacity-90"
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10"
            aria-hidden
          >
            <span
              className="font-serif text-xl font-semibold italic"
              style={{ color: "#fef3c7" }}
            >
              σ
            </span>
          </div>
          <h1 className="m-0 font-serif text-[17px] font-semibold tracking-tight">
            Statistikk-kompendium
          </h1>
        </Link>
        <button
          type="button"
          aria-label="Bytt tema"
          onClick={toggle}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-white/10"
        >
          <Icon size={16} />
        </button>
      </div>
      <nav className="relative z-10 flex flex-wrap gap-1 border-t border-white/10 px-7 py-2 text-[12.5px]">
        {allLinks.map((link) => {
          const active = isActive(location, link);
          return (
            <Link
              key={link.to + link.label}
              to={link.to}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "flex items-center gap-1.5 rounded-md bg-white/15 px-2.5 py-1 font-semibold text-white no-underline"
                  : "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-white/85 no-underline hover:bg-white/10 hover:text-white"
              }
            >
              <link.Icon size={13} />
              {/*
                Render the label twice: visible text is regular weight when
                inactive and bold when active; the hidden ::before sibling
                always reserves the bold width so the nav doesn't shift
                when an item becomes active.
              */}
              <span className="grid">
                <span
                  aria-hidden
                  className="invisible col-start-1 row-start-1 font-semibold"
                >
                  {link.label}
                </span>
                <span className="col-start-1 row-start-1">{link.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
