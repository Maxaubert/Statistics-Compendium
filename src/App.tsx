import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ListView } from "./routes/ListView";
import { EntryDetail } from "./routes/EntryDetail";
import { ConceptRedirect } from "./routes/ConceptRedirect";
import { TableDetail } from "./routes/TableDetail";
import { Glossary } from "./routes/Glossary";
import { Wizard } from "./routes/Wizard";
import { HelpIndex } from "./routes/HelpIndex";
import { HelpCalculator } from "./routes/HelpCalculator";
import { NotFound } from "./routes/NotFound";
import { CalculatorWidget } from "./components/calculator/CalculatorWidget";

export function App() {
  return (
    <BrowserRouter>
      <CalculatorWidget />
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/entry/:id" element={<EntryDetail />} />
        <Route path="/concept/:id" element={<ConceptRedirect />} />
        <Route path="/table/:id" element={<TableDetail />} />
        <Route path="/ordliste" element={<Glossary />} />
        <Route path="/veiviser" element={<Wizard />} />
        <Route path="/hjelp" element={<HelpIndex />} />
        <Route path="/hjelp/kalkulator" element={<HelpCalculator />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
