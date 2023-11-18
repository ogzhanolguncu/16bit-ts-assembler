export function extractFileName(inputString: string): string | null {
  const regexPattern: RegExp = /\/([^\/]+)\.asm$/;

  const matchArray = inputString.match(regexPattern);

  if (matchArray && matchArray.length > 1) {
    return matchArray[1];
  } else {
    return null;
  }
}

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

export const extractContentInParentheses = (instruction: string): boolean => {
  const regex = /\(([^)]+)\)/;
  const match = instruction.match(regex);

  if (match) {
    return true;
  }
  return false;
};

type Fn<A, B> = (_: A) => B;

interface Pipe<A, B> extends Fn<A, B> {
  then<C>(g: Fn<B, C>): Pipe<A, C>;
}

export function pipe<A>(): Pipe<A, A> {
  function _pipe<A, B>(f: Fn<A, B>): Pipe<A, B> {
    return Object.assign(f, {
      then<C>(g: Fn<B, C>): Pipe<A, C> {
        return _pipe<A, C>((a) => g(f(a)));
      },
    });
  }
  return _pipe((a) => a);
}
