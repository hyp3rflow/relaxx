import { Token, Tokenizer } from "../tokenizer/mod.ts";

export interface Parser<ParseFns, InfixParseFns> {
  tokenizer: Tokenizer;
  getPrecedence(): number;
  parseFns: ParseFns;
  infixParseFns: InfixParseFns;
}

export interface Node {}

// @TODO: typing is too hard :(
export interface ParseFn {
  (
    parser: Parser<Record<string, ParseFn>, Record<string, InfixParseFn>>,
    token: Token,
  ): Node;
}

export interface InfixParseFn {
  (
    parser: Parser<Record<string, ParseFn>, Record<string, InfixParseFn>>,
    left: Node,
    token: Token,
  ): Node;
}

export function createParser<
  ParseFns extends Record<string, ParseFn>,
  InfixParseFns extends Record<string, InfixParseFn>,
>(
  tokenizer: Tokenizer,
  parseFns: ParseFns,
  infixParseFns: InfixParseFns,
): Parser<ParseFns, InfixParseFns> {
  const parser: Parser<ParseFns, InfixParseFns> = {
    tokenizer,
    getPrecedence,
    parseFns,
    infixParseFns,
  };
  function getPrecedence() {
    const peek = tokenizer.peek();
    if (!peek) return 0;
    return infixParseFns[peek.type] ? 1 : 0;
  }
  return parser;
}
