export function extractFileName(inputString: string): string | null {
  const regexPattern: RegExp = /\/([^\/]+)\.asm$/;

  const matchArray = inputString.match(regexPattern);

  if (matchArray && matchArray.length > 1) {
    return matchArray[1];
  } else {
    return null;
  }
}

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
