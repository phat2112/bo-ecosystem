import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { sum } from "../utils/helpers";
import App from "../App";

test("demo", () => {
  const total = sum(3, 3);

  expect(total).toEqual(6);
});

test("render main component", () => {
  const component = render(<App />);

  expect(component).toMatchSnapshot();
});
