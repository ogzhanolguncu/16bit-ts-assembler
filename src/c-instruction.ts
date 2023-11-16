import { compTable, destTable, jumpTable } from "./instruction-tables";

export const translateCInstructions = (instruction: string): string => {
  const [dest, tail] = instruction.split("=");
  const [comp, jmp] = tail.split(";");
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
