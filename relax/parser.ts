import {
  createParser,
  InfixParseFn,
  Node,
  ParseFn,
} from "../core/parser/mod.ts";
import { createRelaxTokenizer } from "./tokenizer.ts";

export interface RelaxParser {
  parse(): Node[];
}

export function createRelaxParser(input: string): RelaxParser {
  const tokenizer = createRelaxTokenizer(input);
  const parseFns: Record<string, ParseFn> = {
    "iden": (parser, token) => {
      return { type: "iden", keyword: token.text };
    },
    "element": (parser, token) => {
      const nameClass = parser.tokenizer.next();
      const leftParens = parser.tokenizer.next();
      const pattern = parsePattern(1);
      const rightParens = parser.tokenizer.next();
      return { type: "pattern", keyword: token.text, pattern, nameClass };
    },
    "attribute": (parser, token) => {
      const nameClass = parser.tokenizer.next();
      const leftParens = parser.tokenizer.next();
      const pattern = parsePattern(1);
      const rightParens = parser.tokenizer.next();
      return { type: "pattern", keyword: token.text, pattern, nameClass };
    },
    "list": (parser, token) => {
      const leftParens = parser.tokenizer.next();
      const pattern = parsePattern(1);
      const rightParens = parser.tokenizer.next();
      return { type: "pattern", keyword: token.text, pattern };
    },
    "mixed": (parser, token) => {
      const leftParens = parser.tokenizer.next();
      const pattern = parsePattern(1);
      const rightParens = parser.tokenizer.next();
      return { type: "pattern", keyword: token.text, pattern };
    },
  };
  const infixParseFns: Record<string, InfixParseFn> = {
    "WITH": (parser, left, token) => {
      return { type: "WITH", left, right: parsePattern(1) };
    },
    "AND": (parser, left, token) => {
      return { type: "AND", left, right: parsePattern(1) };
    },
    "OR": (parser, left, token) => {
      return { type: "OR", left, right: parsePattern(1) };
    },
  };
  const parser = createParser(tokenizer, parseFns, infixParseFns);

  return { parse };

  function parse(): Node[] {
    const result: Node[] = [];
    while (parser.tokenizer.peek()) {
      const exp = parsePattern();
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

  function parsePattern(precedence = 0): Node | undefined {
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
