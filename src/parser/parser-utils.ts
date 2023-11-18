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
  return text
    .split("\r\n")
    .filter((line) => !line.startsWith("//") && line !== "")
    .map((instruction) => instruction.trim() && removeCommentsFromInstruction(instruction));
}

export async function readFile(filePath: string) {
  const file = Bun.file(filePath);
  const text = await file.text();
  return text;
}
