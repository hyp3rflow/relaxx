import { createTokenizer, TokenFn } from "../core/tokenizer/mod.ts";

const keywordFns: TokenFn[] = [
  "default",
  "parent",
  "empty",
  "text",
  "notAllowed",
  "external",
  "grammar",
].map((keyword) =>
  (t) => {
    const text = t.accept(keyword);
    if (text) return { text, type: "keyword" };
  }
);

const elementFn = createTokenFn("element", "element");
const attributeFn = createTokenFn("attribute", "attribute");

const listFn = createTokenFn("list", "list");
const mixedFn = createTokenFn("mixed", "mixed");

const withFn = createTokenFn("WITH", ",");
const andFn = createTokenFn("AND", "&");
const orFn = createTokenFn("OR", "|");

const parenFns: TokenFn[] = [
  "{",
  "}",
].map((value) =>
  (t) => {
    const text = t.accept(value);
    if (text) return { text, type: "paren" };
  }
);

const idenFns: TokenFn = (t) => {
  const text = t.accept(/^[A-Za-z0-9]*/);
  if (text) return { text, type: "iden" };
};

export const tokenFns: TokenFn[] = [
  ...keywordFns,
  elementFn,
  attributeFn,
  listFn,
  mixedFn,

  withFn,
  andFn,
  orFn,

  ...parenFns,
  idenFns,
];

export function createRelaxTokenizer(input: string) {
  return createTokenizer(input, tokenFns);
}

function createTokenFn(type: string, pattern: string | RegExp): TokenFn {
  return (t) => {
    const text = t.accept(pattern);
    if (text) return { text, type };
  };
}
