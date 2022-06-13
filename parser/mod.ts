import { Token, Tokenizer } from "../tokenizer/mod.ts";

export interface Parser {
  tokenizer: Tokenizer;
  parse(precedence?: number): Node | undefined;
}

export interface Node {}

export interface ParseFn {
  (parser: Parser, token: Token): Node;
}

export interface InfixParseFn {
  precedence: number;
  (parser: Parser, left: Node, token: Token): Node;
}

export function createParser(
  tokenizer: Tokenizer,
  parseFns: Record<string, ParseFn>,
  infixParseFns: Record<string, InfixParseFn>,
): Parser {
  const parser: Parser = {
    tokenizer,
    parse,
  };
  function parse(precedence = 0): Node | undefined {
    const token = tokenizer.next();
    if (!token) return;
    const parseFn = parseFns[token.type];
    if (!parseFn) return;
    let left: Node = parseFn(parser, token);
    while (precedence < getPrecedence()) {
      const token = tokenizer.next();
      if (!token) return;
      const infixParseFn = infixParseFns[token.type];
      if (!infixParseFn) return;
      left = infixParseFn(parser, left, token);
    }
    return left;
  }
  function getPrecedence() {
    const peek = tokenizer.peek();
    if (!peek) return 0;
    return infixParseFns[peek.type]?.precedence ?? 0;
  }
  return parser;
}
