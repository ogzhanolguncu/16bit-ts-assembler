import { expect, test } from "bun:test";
import { parse } from "./parser";
import { removeCommentsFromInstruction } from "./utils";

test("should remove inline comments from instruction", async () => {
  const binaryOutput = removeCommentsFromInstruction("D=M //HELLO WORLD");
  expect(binaryOutput).toEqual("D=M");
});
