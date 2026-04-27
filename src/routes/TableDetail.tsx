import { useParams } from "react-router-dom";
export function TableDetail() {
  const { id } = useParams();
  return <div data-testid="table-detail">Table: {id}</div>;
}
