import { describe, expect, it } from "vitest";
import { parseRequestOptions } from "../src/utils/requestOptions.js";

describe("parseRequestOptions", () => {
  it("parses strict JSON body and injects content-type", () => {
    const result = parseRequestOptions({
      method: "POST",
      jsonBody: '{"name":"shellreq","version":1}',
    });

    expect(result.body).toBe('{"name":"shellreq","version":1}');
    expect(result.headers["Content-Type"]).toBe("application/json");
    expect(result.headers.Accept).toContain("application/json");
  });

  it("parses loose object input for PowerShell compatibility", () => {
    const result = parseRequestOptions({
      method: "POST",
      jsonBody: "{name:shellreq,version:1}",
    });

    expect(result.body).toBe('{"name":"shellreq","version":1}');
  });

  it("merges custom headers and keeps user-provided content-type", () => {
    const result = parseRequestOptions({
      method: "PATCH",
      headerInputs: ["Authorization: Bearer abc", "Content-Type: application/custom+json"],
      jsonBody: '{"enabled":true}',
    });

    expect(result.headers.Authorization).toBe("Bearer abc");
    expect(result.headers["Content-Type"]).toBe("application/custom+json");
  });

  it("rejects malformed header input", () => {
    expect(() =>
      parseRequestOptions({
        method: "GET",
        headerInputs: ["BrokenHeader"],
      }),
    ).toThrow('Invalid header format "BrokenHeader". Use "Key: Value".');
  });

  it("rejects JSON body for methods without payload support", () => {
    expect(() =>
      parseRequestOptions({
        method: "GET",
        jsonBody: '{"a":1}',
      }),
    ).toThrow("GET does not support a request body.");
  });
});
