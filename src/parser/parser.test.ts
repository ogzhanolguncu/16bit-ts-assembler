import { expect, test } from "bun:test";
import { parse, addAddressesOfLabelsToAddressMap } from ".";
import { preDefinedSymsAndLabels } from "../constants/instruction-tables";
import { readFile, removeWhitespaceAndComments } from "./parser-utils";

test("should parse entire file without symbols correctly", async () => {
  const binaryOutput = await parse("./test-files/Add.asm");
  expect(binaryOutput).toEqual(
    `0000000000000010\n1110110000010000\n0000000000000011\n1110000010010000\n0000000000000000\n1110001100001000\n`
  );
});

test("should give correct updated addresses with labels", async () => {
  const text = await readFile("./test-files/Max.asm");
  const sanitizedContent = removeWhitespaceAndComments(text);

  const updatedAddresses = addAddressesOfLabelsToAddressMap(sanitizedContent);

  const addresses = new Map<string, string>([
    ...preDefinedSymsAndLabels,
    ["OUTPUT_FIRST", "10"],
    ["OUTPUT_D", "12"],
    ["INFINITE_LOOP", "14"],
  ]);

  expect(updatedAddresses.addresses).toEqual(addresses);
});
