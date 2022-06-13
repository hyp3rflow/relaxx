import { createTokenizer, TokenFn } from "../core/tokenizer/mod.ts";

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

export const tokenFns: TokenFn[] = [
  ...keywordFns,
];

export function createRelaxTokenizer(input: string) {
  return createTokenizer(input, tokenFns);
}
