export const eof = Symbol("<EOF>");

export interface Token {
  type: string;
  text: string;
}

export interface Tokenizer {
  readonly input: string;
  position: number;
  next(): Token | undefined;
  peek(): Token | undefined;
  accept(pattern: string | RegExp): string | undefined;
}

export interface TokenFn {
  (tokenizer: Tokenizer): Token | undefined;
}

const whitespacePattern = /^\s+/;

export function createTokenizer(input: string, tokenFns: TokenFn[]): Tokenizer {
  let position = 0;
  const tokenizer: Tokenizer = {
    input,
    position,
    accept,
    next() {
      accept(whitespacePattern);
      for (const tokenFn of tokenFns) {
        const token = tokenFn(tokenizer);
        if (token) return token;
      }
    },
    peek() {
      accept(whitespacePattern);
      for (const tokenFn of tokenFns) {
        const prev = tokenizer.position;
        const token = tokenFn(tokenizer);
        tokenizer.position = prev;
        if (token) return token;
      }
    },
  };
  return tokenizer;
  function accept(pattern: string | RegExp): string | undefined {
    if (typeof pattern === "string") return acceptString(pattern);
    return acceptRegex(pattern);
  }
  function acceptString(pattern: string): string | undefined {
    const start = tokenizer.position;
    const end = start + pattern.length;
    const text = input.slice(start, end);
    if (text !== pattern) return;
    tokenizer.position = end;
    return text;
  }
  function acceptRegex(pattern: RegExp): string | undefined {
    pattern.lastIndex = 0;
    const execArray = pattern.exec(input.slice(tokenizer.position));
    if (execArray == null) return;
    const text = execArray[0];
    const start = tokenizer.position + execArray.index;
    const end = start + text.length;
    tokenizer.position = end;
    return text;
  }
}
