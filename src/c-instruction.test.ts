import { expect, test } from "bun:test";
import { convertDecToBinary, translateCInstructions } from "./c-instruction";

test("should parse simple c instruction", () => {
  const binaryOutput = translateCInstructions("MD=D+1");
  expect(binaryOutput).toEqual("1110011111011000");
});

test("should parse c instruction with jump", () => {
  const binaryOutput = translateCInstructions("MD=A-1;JGE");
  expect(binaryOutput).toEqual("1110110010011011");
});

test("should convert number to binary equivalent", () => {
  expect(convertDecToBinary("16")).toEqual("0000000000010000");
});
