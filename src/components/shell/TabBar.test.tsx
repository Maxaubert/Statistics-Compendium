import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TabBar, type Tab } from "./TabBar";

const tabs: Tab[] = [
  { key: "formler", label: "Formler", count: 47 },
  { key: "konsepter", label: "Konsepter", count: 18 },
  { key: "tabeller", label: "Tabeller", count: 6 },
];

describe("TabBar", () => {
  it("renders all tab labels with counts", () => {
    render(<TabBar tabs={tabs} active="formler" onChange={() => {}} />);
    expect(screen.getByText("Formler")).toBeInTheDocument();
    expect(screen.getByText("47")).toBeInTheDocument();
    expect(screen.getByText("Konsepter")).toBeInTheDocument();
    expect(screen.getByText("Tabeller")).toBeInTheDocument();
  });

  it("calls onChange with the new key when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<TabBar tabs={tabs} active="formler" onChange={onChange} />);
    fireEvent.click(screen.getByText("Konsepter"));
    expect(onChange).toHaveBeenCalledWith("konsepter");
  });

  it("marks the active tab with aria-selected", () => {
    render(<TabBar tabs={tabs} active="konsepter" onChange={() => {}} />);
    const active = screen.getByRole("tab", { selected: true });
    expect(active).toHaveTextContent("Konsepter");
  });
});
