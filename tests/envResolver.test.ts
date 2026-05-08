import { describe, expect, it } from "vitest";
import { resolveUrlWithEnv } from "../src/env/resolver.js";

describe("resolveUrlWithEnv", () => {
  it("replaces placeholders with environment values", () => {
    process.env.API_BASE_URL = "https://api.example.com";

    const resolved = resolveUrlWithEnv("{{API_BASE_URL}}/v1/items");
    expect(resolved).toBe("https://api.example.com/v1/items");
  });

  it("throws readable error when variables are missing", () => {
    delete process.env.UNKNOWN_KEY;

    expect(() => resolveUrlWithEnv("{{UNKNOWN_KEY}}/ping")).toThrow(
      "Missing environment variable(s): UNKNOWN_KEY",
    );
  });
});
