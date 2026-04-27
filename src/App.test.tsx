import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { App } from "./App";

describe("App", () => {
  it("renders the list view at /", () => {
    render(<App />);
    expect(screen.getByTestId("list-view")).toBeInTheDocument();
  });
});
