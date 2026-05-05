import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PrintedTable } from "./PrintedTable";

describe("PrintedTable — Z (normal cumulative)", () => {
  // Regression: z >= 3.4 used to crash the page. The 7-row window
  // centered on |z| got entirely filtered out (3.1..3.7 all fall
  // outside [-3, 3]), and `reduce` on the empty array threw.
  it.each([-3.5, -3.4, 3.4, 3.5, 5, -10])(
    "renders without crashing for out-of-range z = %s",
    (z) => {
      expect(() =>
        render(
          <PrintedTable distribution="normal_cumulative" inputs={{ z }} />,
        ),
      ).not.toThrow();
    },
  );

  it.each([-3, -2, -1, 0, 1, 2, 3])(
    "renders without crashing for in-range z = %s",
    (z) => {
      expect(() =>
        render(
          <PrintedTable distribution="normal_cumulative" inputs={{ z }} />,
        ),
      ).not.toThrow();
    },
  );
});
