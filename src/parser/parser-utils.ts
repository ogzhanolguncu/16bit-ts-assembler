import { readFileSync } from "fs";

export const removeCommentsFromInstruction = (instruction: string) => {
  const trimmedInstruction = instruction.replaceAll(" ", "");
  let instructionWithoutComment = "";
  let currentPosition = 0;

  while (currentPosition < trimmedInstruction.length) {
    const currentChar = trimmedInstruction[currentPosition];

    if (
      currentChar === "/" &&
      currentPosition < trimmedInstruction.length - 1 &&
      trimmedInstruction[currentPosition + 1] === "/"
    ) {
      // Skip characters until the end of the line
      while (
        currentPosition < trimmedInstruction.length &&
        trimmedInstruction[currentPosition] !== "\n"
      ) {
        currentPosition++;
      }
    } else {
      instructionWithoutComment += currentChar;
      currentPosition++;
    }
  }

  return instructionWithoutComment;
};

export const extractLabelInParentheses = (instruction: string): string | null => {
  const regex = /\(([^)]+)\)/;
  const match = instruction.match(regex);

  return match ? match[1] : null;
};

export const removeLabels = (instruction: string) => !extractLabelInParentheses(instruction);

export function removeWhitespaceAndComments(text: string) {
  const output = text
    .split(/[\r\n]+/) // Split by one or more newline characters
    .filter((line) => !line.startsWith("//") && line !== "")
    .map((instruction) => removeCommentsFromInstruction(instruction.replaceAll("\t", "").trim()));

  if (output.length === 0) throw new Error("removeWhitespaceAndComments failed output is empty!");
  return output;
}

export function readFile(filePath: string): string {
  try {
    const text = readFileSync(filePath, "utf-8");
    return text;
  } catch (error) {
    console.error(`Error reading file: ${(error as Error).message}`);
    throw error;
  }
}
