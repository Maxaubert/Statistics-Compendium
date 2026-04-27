import { useParams } from "react-router-dom";
export function EntryDetail() {
  const { id } = useParams();
  return <div data-testid="entry-detail">Entry: {id}</div>;
}
