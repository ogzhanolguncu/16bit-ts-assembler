import { convertDecToBinary, translateCInstructions } from "./c-instruction";
import { extractFileName, pipe, removeCommentsFromInstruction } from "./utils";

export const parse = async (filePath: string) => {
  const file = Bun.file(filePath);
  const text = await file.text();

  const sanitizedContent = text
    .split("\r\n")
    .filter((line) => !line.startsWith("//") && line !== "");
  let binaryFormat = "";

  for (const instruction of sanitizedContent) {
    if (instruction.startsWith("@")) {
      const [_, decimalPart] = instruction.split("@");
      const convertDecimal = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((dec) => convertDecToBinary(dec) + "\n");
      binaryFormat += convertDecimal(decimalPart);
    } else {
      const parseCInstruction = pipe<string>()
        .then(removeCommentsFromInstruction)
        .then((innerInstruction) => translateCInstructions(innerInstruction) + "\n");
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

await parse("./test-files/MaxL.asm");
