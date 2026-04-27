import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ActiveFilterPills } from "./ActiveFilterPills";

describe("ActiveFilterPills", () => {
  it("renders a pill per selected option with the human label", () => {
    render(
      <ActiveFilterPills
        items={[
          { dim: "computes", optionKey: "exact_probability", label: "Sannsynlighet (eksakt)" },
          { dim: "random_variable", optionKey: "discrete_count", label: "Diskret antall" },
        ]}
        onRemove={() => {}}
      />
    );
    expect(screen.getByText("Sannsynlighet (eksakt)")).toBeInTheDocument();
    expect(screen.getByText("Diskret antall")).toBeInTheDocument();
  });

  it("calls onRemove with dim+optionKey when × clicked", () => {
    const onRemove = vi.fn();
    render(
      <ActiveFilterPills
        items={[{ dim: "computes", optionKey: "exact_probability", label: "X" }]}
        onRemove={onRemove}
      />
    );
    fireEvent.click(screen.getByLabelText(/fjern X/i));
    expect(onRemove).toHaveBeenCalledWith("computes", "exact_probability");
  });
});
