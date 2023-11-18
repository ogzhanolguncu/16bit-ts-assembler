import { preDefinedSymsAndLabels } from "../constants/instruction-tables";
import {
  extractLabelInParentheses,
  readFile,
  removeCommentsFromInstruction,
  removeNewlineAndComments,
} from "./parser-utils";

export const parse = async (filePath: string) => {
  const text = await readFile(filePath);
  const sanitizedContent = removeNewlineAndComments(text);
  const addresses = updateAddMapWithLabels(sanitizedContent);
  //   let binaryFormat = "";
  //   for (const instruction of sanitizedContent) {
  //     if (instruction.startsWith("@")) {
  //       const [_, decimalPart] = instruction.split("@");
  //       const convertDecimal = pipe<string>()
  //         .then(removeCommentsFromInstruction)
  //         .then((dec) => convertDecToBinary(dec) + "\n");
  //       binaryFormat += convertDecimal(decimalPart);
  //     } else {
  //       const parseCInstruction = pipe<string>()
  //         .then(removeCommentsFromInstruction)
  //         .then((innerInstruction) => translateCInstructions(innerInstruction) + "\n");
  //       binaryFormat += parseCInstruction(instruction);
  //     }
  //   }

  //   try {
  //     Bun.write(`${extractFileName(filePath)}.hack`, binaryFormat);
  //   } catch (error) {
  //     console.log("Something went wrong when saving to a file");
  //   }

  return "";
};

export function updateAddMapWithLabels(sanitizedContent: string[]) {
  const addresses = new Map<string, string>(preDefinedSymsAndLabels);

  let foundLabelCount = 0;

  for (const [idx, instruction] of sanitizedContent.entries()) {
    const trimmedInstruction = removeCommentsFromInstruction(instruction.trim());
    const label = extractLabelInParentheses(trimmedInstruction);

    if (label) {
      const labelIndex = String(idx - foundLabelCount++);
      addresses.set(label, labelIndex);
    }
  }

  return addresses;
}

await parse("./test-files/Max.asm");
