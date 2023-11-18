import { translateAInstruction } from "../a-instruction/a-instruction";
import { translateCInstruction } from "../c-instruction";
import { preDefinedSymsAndLabels } from "../constants/instruction-tables";
import { extractFileName, pipe } from "../utils";
import {
  extractLabelInParentheses,
  readFile,
  removeCommentsFromInstruction,
  removeLabels,
  removeWhitespaceAndComments,
} from "./parser-utils";

export const parse = async (filePath: string) => {
  const text = await readFile(filePath);
  const tryParse = pipe<string>()
    .then(removeWhitespaceAndComments)
    .then(addAddressesOfLabelsToAddressMap)
    .then(removeLabelsFromInstructionList)
    .then(replacePrefinedSymbolsAndLabelsWithAddresses);

  const instructionList = tryParse(text);

  let binaryFormat = "";
  for (const instruction of instructionList) {
    if (instruction.startsWith("@")) {
      const convertDecimal = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((instruction) => translateAInstruction(instruction) + "\n");
      binaryFormat += convertDecimal(instruction);
    } else {
      const parseCInstruction = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((innerInstruction) => translateCInstruction(innerInstruction) + "\n");
      binaryFormat += parseCInstruction(instruction);
    }
  }

  try {
    Bun.write(`${extractFileName(filePath)}.hack`, binaryFormat);
  } catch (error) {
    console.log("Something went wrong when saving to a file");
  }

  return binaryFormat;
};

function replacePrefinedSymbolsAndLabelsWithAddresses({
  addresses,
  instructionList,
}: {
  instructionList: string[];
  addresses: Map<string, string>;
}) {
  return instructionList.map((instruction) => {
    const cleanedInstruction = instruction.replace("@", "");
    const address = addresses.get(cleanedInstruction);

    if (address !== undefined) {
      return `@${address}`;
    }

    return instruction;
  });
}

const removeLabelsFromInstructionList = ({
  addresses,
  instructionList,
}: {
  instructionList: string[];
  addresses: Map<string, string>;
}) => ({
  instructionList: instructionList.filter(removeLabels),
  addresses,
});

export function addAddressesOfLabelsToAddressMap(instructionList: string[]) {
  const addresses = new Map<string, string>(preDefinedSymsAndLabels);

  let foundLabelCount = 0;

  for (const [idx, instruction] of instructionList.entries()) {
    const trimmedInstruction = removeCommentsFromInstruction(instruction);
    const label = extractLabelInParentheses(trimmedInstruction);

    if (label) {
      const labelIndex = String(idx - foundLabelCount++);
      addresses.set(label, labelIndex);
    }
  }

  return { addresses, instructionList };
}

await parse("./test-files/Max.asm");
