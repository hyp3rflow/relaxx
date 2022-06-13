import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { createTokenizer, TokenFn } from "./mod.ts";

Deno.test("tokenizer [#1]", () => {
  const input = "abc";
  const tokenFns: TokenFn[] = [
    (tokenizer) => {
      const text = tokenizer.accept("a");
      if (text) return { text, type: "a" };
    },
    (tokenizer) => {
      const text = tokenizer.accept("b");
      if (text) return { text, type: "b" };
    },
    (tokenizer) => {
      const text = tokenizer.accept("c");
      if (text) return { text, type: "c" };
    },
  ];
  const tokenizer = createTokenizer(input, tokenFns);
  assertEquals(tokenizer.next(), { text: "a", type: "a" });
  assertEquals(tokenizer.next(), { text: "b", type: "b" });
  assertEquals(tokenizer.next(), { text: "c", type: "c" });
  assertEquals(tokenizer.next(), undefined);
});

Deno.test("tokenizer [#2]", () => {
  const input = "abc";
  const tokenFns: TokenFn[] = [
    (tokenizer) => {
      const text = tokenizer.accept("a");
      if (text) return { text, type: "a" };
    },
    (tokenizer) => {
      const text = tokenizer.accept("b");
      if (text) return { text, type: "b" };
    },
    (tokenizer) => {
      const text = tokenizer.accept("c");
      if (text) return { text, type: "c" };
    },
  ];
  const tokenizer = createTokenizer(input, tokenFns);
  assertEquals(tokenizer.peek(), { text: "a", type: "a" });
  assertEquals(tokenizer.next(), { text: "a", type: "a" });
  assertEquals(tokenizer.next(), { text: "b", type: "b" });
  assertEquals(tokenizer.peek(), { text: "c", type: "c" });
  assertEquals(tokenizer.next(), { text: "c", type: "c" });
  assertEquals(tokenizer.next(), undefined);
});
