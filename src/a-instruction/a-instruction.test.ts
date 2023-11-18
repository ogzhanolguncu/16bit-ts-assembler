import { expect, test } from "bun:test";
import { translateAInstruction } from "./a-instruction";

test("should convert number to binary equivalent", () => {
  expect(translateAInstruction("@16")).toEqual("0000000000010000");
});
