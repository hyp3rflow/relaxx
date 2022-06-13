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
