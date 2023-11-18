import { describe, expect, test } from "bun:test";
import { convertDecToBinary, translateCInstructions } from "./c-instruction";

describe("C-Instruction with destination and computation", () => {
  test("should parse simple c instruction", () => {
    const binaryOutput = translateCInstructions("MD=D+1");
    expect(binaryOutput).toEqual("1110011111011000");
  });
});

describe("C-Instruction with destination, computation and jump", () => {
  test("should parse c instruction with jump", () => {
    const binaryOutput = translateCInstructions("MD=A-1;JGE");
    expect(binaryOutput).toEqual("1110110010011011");
  });
});

describe("C-Instruction with computation and jump", () => {
  test("should parse c instruction with jump without dest", () => {
    const binaryOutput = translateCInstructions("D;JGT");
    expect(binaryOutput).toEqual("1110001100000001");
  });
});

test("should convert number to binary equivalent", () => {
  expect(convertDecToBinary("16")).toEqual("0000000000010000");
});
