import { compTable, destTable, jumpTable } from "../constants/instruction-tables";

const PREFIX = "111";

export const translateCInstruction = (instruction: string): string => {
  const { comp, dest, jmp } = extractHeadAndTail(instruction);

  const destTableResult = destTable[dest ?? "null"];
  const compTableResult = compTable[comp];
  const jumpTableResult = jumpTable[jmp ?? "null"];

  return `${PREFIX}${compTableResult}${destTableResult}${jumpTableResult}`;
};

const extractHeadAndTail = (instruction: string): { comp: string; jmp: string; dest: string } => {
  // Input validation
  if (typeof instruction !== "string") {
    console.error("Invalid input. Expected a string.");
    throw new Error("Invalid input");
  }

  switch (true) {
    case instruction.includes("=") || (instruction.includes(";") && instruction.includes("=")): {
      // Extract dest, comp, and jmp
      const [dest, tail] = instruction.split("=");
      const [comp, jmp] = tail.split(";");
      return { comp, jmp, dest };
    }

    case instruction.includes(";"): {
      // Extract comp and jmp
      const [comp, jmp] = instruction.split(";");
      return { comp, jmp, dest: "null" };
    }

    default: {
      // Handle unknown instructions
      console.error(`Unknown instruction: ${instruction}`);
      throw new Error(`Unknown instruction: ${instruction}`);
    }
  }
};
