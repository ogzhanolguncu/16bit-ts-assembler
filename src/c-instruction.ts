import { compTable, destTable, jumpTable } from "./instruction-tables";

export const translateCInstructions = (instruction: string): string => {
  const { comp, dest, jmp } = extractHeadAndTail(instruction);

  const destTableResult = destTable[dest ?? "null"];
  const compTableResult = compTable[comp];
  const jumpTableResult = jumpTable[jmp ?? "null"];

  const prefix = "111";

  return `${prefix}${compTableResult}${destTableResult}${jumpTableResult}`;
};

export const convertDecToBinary = (value: string): string => {
  let binary = Number(value).toString(2);

  while (binary.length < 16) {
    binary = "0" + binary;
  }
  return binary;
};

const extractHeadAndTail = (instruction: string): { comp: string; jmp: string; dest: string } => {
  if (instruction.includes("=") || (instruction.includes(";") && instruction.includes("="))) {
    const [dest, tail] = instruction.split("=");
    const [comp, jmp] = tail.split(";");
    return { comp, jmp, dest };
  } else if (instruction.includes(";")) {
    let dest = "null";
    const [comp, jmp] = instruction.split(";");
    return { comp, jmp, dest };
  } else {
    console.error(`Unknown instruction: ${instruction}`);
    throw new Error("Unknown instruction");
  }
};
