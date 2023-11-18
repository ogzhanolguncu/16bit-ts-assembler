import { convertDecToBinary, translateCInstructions } from "./c-instruction";
import { extractFileName } from "./utils";

export const parse = async (filePath: string) => {
  const file = Bun.file(filePath);
  const text = await file.text();

  const sanitizedContent = text.split("\r\n").filter((x) => !x.startsWith("//") && x !== "");
  let binaryFormat = "";
  for (const instruction of sanitizedContent) {
    const last = sanitizedContent[sanitizedContent.length - 1] === instruction;

    if (instruction.startsWith("@")) {
      const [_, decimalPart] = instruction.split("@");
      binaryFormat += convertDecToBinary(decimalPart) + "\n";
    } else {
      binaryFormat += translateCInstructions(instruction) + "\n";
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
