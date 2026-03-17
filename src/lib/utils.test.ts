import { describe, expect, test } from "bun:test";
import { slugify } from "./utils";

describe("slugify", () => {
  test("converts basic text to lowercase slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  test("trims leading and trailing whitespace", () => {
    expect(slugify("  hello world  ")).toBe("hello-world");
  });

  test("replaces multiple spaces with a single dash", () => {
    expect(slugify("hello    world")).toBe("hello-world");
  });

  test("removes non-word characters (except dashes)", () => {
    expect(slugify("hello @ world!")).toBe("hello-world");
    expect(slugify("it's a beautiful day")).toBe("its-a-beautiful-day");
  });

  test("replaces multiple dashes with a single dash", () => {
    expect(slugify("hello--world")).toBe("hello-world");
    expect(slugify("hello---world")).toBe("hello-world");
  });

  test("trims leading and trailing dashes", () => {
    expect(slugify("-hello-world-")).toBe("hello-world");
    expect(slugify("--hello--world--")).toBe("hello-world");
  });

  test("handles empty string", () => {
    expect(slugify("")).toBe("");
  });

  test("handles string with only special characters", () => {
    expect(slugify("@#$%^&*")).toBe("");
  });

  test("handles complex mix of characters", () => {
    expect(slugify("  Hello!!! --- World --- 2024  ")).toBe("hello-world-2024");
  });

  test("preserves underscores as they are word characters", () => {
    expect(slugify("hello_world")).toBe("hello_world");
  });
});
