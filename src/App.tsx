import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ListView } from "./routes/ListView";
import { EntryDetail } from "./routes/EntryDetail";
import { ConceptRedirect } from "./routes/ConceptRedirect";
import { TableDetail } from "./routes/TableDetail";
import { Glossary } from "./routes/Glossary";
import { Wizard } from "./routes/Wizard";
import { MockupTabs } from "./routes/MockupTabs";
import { MockupSteps } from "./routes/MockupSteps";
import { MockupStepsC } from "./routes/MockupStepsC";
import { MockupTabsSeparated } from "./routes/MockupTabsSeparated";
import { MockupTabsV2 } from "./routes/MockupTabsV2";
import { MockupTabsV3 } from "./routes/MockupTabsV3";
import { MockupProperty } from "./routes/MockupProperty";
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
        <Route path="/mockups/tabs" element={<MockupTabs />} />
        <Route path="/mockups/steps" element={<MockupSteps />} />
        <Route path="/mockups/steps/c" element={<MockupStepsC />} />
        <Route path="/mockups/tabs/separated" element={<MockupTabsSeparated />} />
        <Route path="/mockups/tabs/v2" element={<MockupTabsV2 />} />
        <Route path="/mockups/tabs/v3" element={<MockupTabsV3 />} />
        <Route path="/mockups/property" element={<MockupProperty />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
