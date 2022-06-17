import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { createRelaxParser } from "./parser.ts";

Deno.test("parseRelaxNG [#1]", () => {
  const input = "element identifier { attribute identifier2 { identifier3 } }";
  const parser = createRelaxParser(input);
  const result = parser.parse();
  assertEquals(result, [{
    keyword: "element",
    nameClass: {
      text: "identifier",
      type: "iden",
    },
    pattern: {
      keyword: "attribute",
      nameClass: {
        text: "identifier2",
        type: "iden",
      },
      pattern: {
        keyword: "identifier3",
        type: "iden",
      },
      type: "pattern",
    },
    type: "pattern",
  }]);
});

Deno.test("parseRelaxNG [#2]", () => {
  const input = "element identifier { list { identifier2 } }";
  const parser = createRelaxParser(input);
  const result = parser.parse();
  assertEquals(result, [{
    keyword: "element",
    nameClass: {
      text: "identifier",
      type: "iden",
    },
    pattern: {
      keyword: "list",
      pattern: {
        keyword: "identifier2",
        type: "iden",
      },
      type: "pattern",
    },
    type: "pattern",
  }]);
});
