import { useParams } from "react-router-dom";
export function ConceptDetail() {
  const { id } = useParams();
  return <div data-testid="concept-detail">Concept: {id}</div>;
}
