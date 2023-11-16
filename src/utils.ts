export function extractFileName(inputString: string): string | null {
  const regexPattern: RegExp = /\/([^\/]+)\.asm$/;

  const matchArray = inputString.match(regexPattern);

  if (matchArray && matchArray.length > 1) {
    return matchArray[1];
  } else {
    return null;
  }
}
