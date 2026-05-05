import { Navigate, useParams } from "react-router-dom";

/**
 * Phase 3 cleanup: konsepter were folded into entries. Old `/concept/:id`
 * URLs (bookmarks, external links, crossrefs anyone forgot to update) keep
 * working by 301-style redirecting to the matching `/entry/:id`.
 *
 * Three concept ids collide with existing entry ids — the old concept now
 * lives at `<id>-oversikt` to keep both pieces around. Everything else maps
 * 1:1.
 */
const ID_REMAP: Record<string, string> = {
  varians: "varians-oversikt",
  standardavvik: "standardavvik-oversikt",
  forventningsverdi: "forventningsverdi-oversikt",
};

export function ConceptRedirect() {
  const { id } = useParams<{ id: string }>();
  const target = id ? (ID_REMAP[id] ?? id) : "";
  if (!target) return <Navigate to="/" replace />;
  return <Navigate to={`/entry/${target}`} replace />;
}
