/**
 * test if a single string is converted correctly
 * test if a multi-line string is converted correctly
 * test if a multi-line with same deployment is combined correctly
 */

import { imageLinesToKubelines } from "./";

const SINGLE_LINE =
  "deployment.example.backend=eu.gcr.io/example/awesome:latest";
const MULTI_LINE =
  "deployment.example.backend=eu.gcr.io/example/awesome:latest\ndeployment.example2.frontend=eu.gcr.io/example/awesome:latest\ndeployment.sidecart.sidecart=eu.gcr.io/example/awesome:latest";
const MULTI_LINE_GROUP =
  "deployment.example.backend=eu.gcr.io/example/awesome:latest\ndeployment.example.frontend=eu.gcr.io/example/awesome:latest\ndeployment.sidecart.sidecart=eu.gcr.io/example/awesome:latest";

// input test
test("if a single string is converted correctly", () => {
  const lines = "deployment.example.backend=eu.gcr.io/example/awesome:latest";
  const res = imageLinesToKubelines(SINGLE_LINE, "default", false);
  expect(res.length).toBe(1);
});

test("if a multi-line works", () => {
  const res = imageLinesToKubelines(MULTI_LINE, "default", false);
  expect(res.length).toBe(3);
  console.log(res);
});

test("grouping of same deployment into fewer lines", () => {
  const res = imageLinesToKubelines(MULTI_LINE_GROUP, "default", false);
  expect(res.length).toBe(2);
  console.log(res);
});

test("grouping + wait", () => {
  const res = imageLinesToKubelines(MULTI_LINE_GROUP, "default", true);
  expect(res.length).toBe(4);
  console.log(res);
});

// logic test
