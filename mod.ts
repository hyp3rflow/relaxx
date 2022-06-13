import { createParser, InfixParseFn, Node, ParseFn } from "./parser/mod.ts";
import { createTokenizer, TokenFn } from "./tokenizer/mod.ts";

const keywordFns: TokenFn[] = [
  "attribute",
  "default",
  "datatypes",
  "div",
  "element",
  "empty",
  "external",
  "grammar",
  "include",
  "inherit",
  "list",
  "mixed",
  "namespace",
  "notAllowed",
  "parent",
  "start",
  "string",
  "text",
  "token",
].map((keyword) =>
  (t) => {
    const text = t.accept(keyword);
    if (text) return { text, type: "keyword" };
  }
);

const tokenFns: TokenFn[] = [
  ...keywordFns,
];

export interface RelaxParser {
  parse(): Node[];
}

export function createRelaxParser(input: string): RelaxParser {
  const tokenizer = createTokenizer(input, tokenFns);
  const parseFns: Record<string, ParseFn> = {
    "keyword": (parser, token) => {
      return { type: "keyword", text: token.text };
    },
  };
  const infixParseFns: Record<string, InfixParseFn> = {};
  const parser = createParser(tokenizer, parseFns, infixParseFns);

  return { parse };

  function parse(): Node[] {
    const result: Node[] = [];
    while (parser.tokenizer.peek()) {
      const exp = parseExpression();
      if (exp) result.push(exp);
    }
    return result;
  }

  function parseTopLevel(): Node | undefined {
    return;
  }

  function parseDeclaration(): Node | undefined {
    return;
  }

  function parseExpression(precedence = 0): Node | undefined {
    const token = tokenizer.next();
    if (!token) return;
    const parseFn = parseFns[token.type];
    if (!parseFn) return;
    let left: Node = parseFn(parser, token);
    while (precedence < parser.getPrecedence()) {
      const token = tokenizer.next();
      if (!token) return;
      const infixParseFn = parser.infixParseFns[token.type];
      if (!infixParseFn) return;
      left = infixParseFn(parser, left, token);
    }
    return left;
  }
}
