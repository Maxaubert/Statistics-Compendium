import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterSidebar } from "./FilterSidebar";
import type { Filters } from "@/data/schema";

const filtersConfig: Filters = {
  dimensions: [
    {
      key: "computes",
      label_no: "Beregner",
      options: [
        { key: "exact_probability", label_no: "Sannsynlighet (eksakt)" },
        { key: "expected_value", label_no: "Forventningsverdi" },
      ],
    },
  ],
};

describe("FilterSidebar", () => {
  it("renders a dimension header", () => {
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    expect(screen.getByText("Beregner")).toBeInTheDocument();
  });

  it("expands a group and shows options with counts", () => {
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={() => {}}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Beregner"));
    expect(screen.getByText("Sannsynlighet (eksakt)")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("calls onToggle when an option is clicked", () => {
    const onToggle = vi.fn();
    render(
      <FilterSidebar
        filters={filtersConfig}
        selection={{}}
        counts={{ computes: { exact_probability: 5, expected_value: 3 } }}
        onToggle={onToggle}
        onClear={() => {}}
      />
    );
    fireEvent.click(screen.getByText("Beregner"));
    fireEvent.click(screen.getByLabelText(/Sannsynlighet/));
    expect(onToggle).toHaveBeenCalledWith("computes", "exact_probability");
  });
});
