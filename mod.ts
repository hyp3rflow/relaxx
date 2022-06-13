import { createParser, ParseFn } from "./parser/mod.ts";
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

export function parseRelaxNG(input: string): any {
  const tokenizer = createTokenizer(input, tokenFns);
  const parseFns: Record<string, ParseFn> = {
    "keyword": (parser, token) => {
      return { type: "keyword", text: token.text };
    },
  };
  const infixParseFns = {};
  const parser = createParser(tokenizer, parseFns, infixParseFns);
  const result = [];
  while (parser.tokenizer.peek()) {
    result.push(parser.parse());
  }
  return result;
}
