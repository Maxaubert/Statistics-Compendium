import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { RecognitionCues } from "./RecognitionCues";

describe("RecognitionCues", () => {
  it("renders each cue as a list item", () => {
    render(<RecognitionCues cues={["a", "b"]} />);
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });
  it("uses warn styling when variant=warn", () => {
    const { container } = render(<RecognitionCues cues={["x"]} variant="warn" />);
    expect(container.firstChild).toHaveClass("warn");
  });
});
