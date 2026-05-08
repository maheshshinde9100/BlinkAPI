import { afterEach, describe, expect, it, vi } from "vitest";
import { executeHttpRequest } from "../src/http/client.js";

describe("executeHttpRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns structured success result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response('{"ok":true}', {
          status: 200,
          statusText: "OK",
          headers: {
            "content-type": "application/json",
          },
        });
      }),
    );

    const result = await executeHttpRequest({
      method: "GET",
      url: "https://example.com",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.response.status).toBe(200);
      expect(result.response.body).toBe('{"ok":true}');
      expect(result.response.headers["content-type"]).toBe("application/json");
      expect(result.response.durationMs).toBeGreaterThanOrEqual(0);
    }
  });

  it("returns structured failure result", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("fetch exploded");
      }),
    );

    const result = await executeHttpRequest({
      method: "GET",
      url: "https://example.com",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMessage).toBe("fetch exploded");
      expect(result.method).toBe("GET");
    }
  });
});
