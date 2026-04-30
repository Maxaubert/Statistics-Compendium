import { HashRouter, Routes, Route } from "react-router-dom";
import { ListView } from "./routes/ListView";
import { EntryDetail } from "./routes/EntryDetail";
import { ConceptDetail } from "./routes/ConceptDetail";
import { TableDetail } from "./routes/TableDetail";
import { SymbolTable } from "./routes/SymbolTable";
import { Cheatsheet } from "./routes/Cheatsheet";
import { Glossary } from "./routes/Glossary";
import { NotFound } from "./routes/NotFound";

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/entry/:id" element={<EntryDetail />} />
        <Route path="/concept/:id" element={<ConceptDetail />} />
        <Route path="/table/:id" element={<TableDetail />} />
        <Route path="/symboler" element={<SymbolTable />} />
        <Route path="/cheatsheet" element={<Cheatsheet />} />
        <Route path="/ordliste" element={<Glossary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}
