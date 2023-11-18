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

const INITIAL_ADDRESS = 16;

export const parse = async () => {
  const filePath = parseArguments();

  const tryParse = pipe<string>()
    .then(readFile)
    .then(removeWhitespaceAndComments)
    .then(addAddressesOfLabelsToAddressMap)
    .then(removeLabelsFromInstructionList)
    .then(replacePrefinedSymbolsAndLabelsWithAddresses)
    .then(replaceCustomSymbolsWithAddresses)
    .then(parseCAndAInstructions)
    .then((binary) => writeToAFile(filePath, binary));

  tryParse(filePath);
};

function parseArguments() {
  const filePath = Bun.argv.at(-1);
  if (!filePath || !filePath.includes(".asm")) {
    throw new Error("File path is missing!. Example: bun run parse file=./test-files/Add.asm");
  }
  return filePath;
}

function writeToAFile(filePath: string, binaryFormat: string) {
  try {
    Bun.write(`${extractFileName(filePath)}.hack`, binaryFormat);
  } catch (error) {
    console.log("Something went wrong when saving to a file");
  }
}

function parseCAndAInstructions({ instructionList }: { instructionList: string[] }) {
  let binaryFormat = "";
  for (const instruction of instructionList) {
    if (instruction.startsWith("@")) {
      const convertDecimal = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((instruction) => `${translateAInstruction(instruction)}\n`);
      binaryFormat += convertDecimal(instruction);
    } else {
      const parseCInstruction = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((innerInstruction) => `${translateCInstruction(innerInstruction)}\n`);
      binaryFormat += parseCInstruction(instruction);
    }
  }
  return binaryFormat;
}

function replaceCustomSymbolsWithAddresses({
  addresses,
  instructionList,
}: {
  instructionList: string[];
  addresses: Map<string, string>;
}) {
  //Starts from 16, because first 15 is reserved for prefined addresses
  let nextAddress = INITIAL_ADDRESS;

  for (let idx = 0; idx < instructionList.length; idx++) {
    const instruction = instructionList[idx];

    const matchSymbol = /@([a-zA-Z_][a-zA-Z_\d.]*)/.exec(instruction);

    if (matchSymbol) {
      const symbol = matchSymbol[1];

      if (!addresses.has(symbol)) {
        addresses.set(symbol, nextAddress.toString());
        instructionList[idx] = `@${nextAddress.toString()}`;
        nextAddress++;
      } else {
        instructionList[idx] = `@${addresses.get(symbol)}`;
      }
    }
  }

  return { instructionList, addresses };
}

function replacePrefinedSymbolsAndLabelsWithAddresses({
  addresses,
  instructionList,
}: {
  instructionList: string[];
  addresses: Map<string, string>;
}) {
  return {
    instructionList: instructionList.map((instruction) => {
      const cleanedInstruction = instruction.replace("@", "");
      const address = addresses.get(cleanedInstruction);

      if (address !== undefined) {
        return `@${address}`;
      }

      return instruction;
    }),
    addresses,
  };
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

await parse();
