// This is a simple test that checks if 1 + 2 equals 3

Deno.test("should add two numbers correctly", () => {
  const result = 1 + 2;
  if (result !== 3) {
    throw new Error("Test failed: expected 1 + 2 to be 3");
  }
});

Deno.test("should check if string is equal to 'hello'", () => {
  const str = "hello";
  if (str !== "hello") {
    throw new Error("Test failed: string should be 'hello'");
  }
});
