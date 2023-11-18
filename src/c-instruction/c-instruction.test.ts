import { describe, expect, test } from "bun:test";
import { translateCInstruction } from ".";

describe("C-Instruction with destination and computation", () => {
  test("should parse simple c instruction", () => {
    const binaryOutput = translateCInstruction("MD=D+1");
    expect(binaryOutput).toEqual("1110011111011000");
  });
});

describe("C-Instruction with destination, computation and jump", () => {
  test("should parse c instruction with jump", () => {
    const binaryOutput = translateCInstruction("MD=A-1;JGE");
    expect(binaryOutput).toEqual("1110110010011011");
  });
});

describe("C-Instruction with computation and jump", () => {
  test("should parse c instruction with jump without dest", () => {
    const binaryOutput = translateCInstruction("D;JGT");
    expect(binaryOutput).toEqual("1110001100000001");
  });
});
