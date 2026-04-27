import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export function Banner() {
  const { theme, toggle } = useTheme();
  const Icon = theme === "light" ? Moon : Sun;
  return (
    <header
      className="relative overflow-hidden text-paper-2"
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
          className="flex items-center gap-3 text-paper-2 no-underline transition-opacity hover:opacity-90"
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
    </header>
  );
}
