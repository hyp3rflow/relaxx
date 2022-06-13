import { assertEquals } from "https://deno.land/std@0.143.0/testing/asserts.ts";
import { createRelaxParser } from "./mod.ts";

Deno.test("parseRelaxNG [#1]", () => {
  const input = "default notAllowed";
  const parser = createRelaxParser(input);
  const result = parser.parse();
  assertEquals(result, [{ type: "keyword", text: "default" }, {
    type: "keyword",
    text: "notAllowed",
  }]);
});
