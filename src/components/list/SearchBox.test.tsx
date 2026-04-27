import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("renders placeholder", () => {
    render(<SearchBox value="" onChange={() => {}} placeholder="Søk..." />);
    expect(screen.getByPlaceholderText("Søk...")).toBeInTheDocument();
  });
  it("calls onChange with new value when user types", () => {
    const onChange = vi.fn();
    render(<SearchBox value="" onChange={onChange} placeholder="x" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "po" } });
    expect(onChange).toHaveBeenCalledWith("po");
  });
});
