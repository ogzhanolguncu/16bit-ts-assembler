import { expect, test } from "bun:test";
import { parse } from "./parser";

test("should parse entire file without symbols correctly", async () => {
  const binaryOutput = await parse("./test-files/Add.asm");
  expect(binaryOutput).toEqual(
    `0000000000000010\n1110110000010000\n0000000000000011\n1110000010010000\n0000000000000000\n1110001100001000\n`
  );
});
