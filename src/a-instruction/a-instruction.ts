export const translateAInstruction = (instruction: string): string => {
  const [_, decimalPart] = instruction.split("@");

  let binary = Number(decimalPart).toString(2);

  while (binary.length < 16) {
    binary = "0" + binary;
  }
  return binary;
};
