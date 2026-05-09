import { afterEach, describe, expect, it, vi } from "vitest";
import { executeHttpRequest } from "../src/http/client.js";
import axios from "axios";

vi.mock("axios");

describe("executeHttpRequest", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns structured success result", async () => {
    const mockedAxios = vi.mocked(axios);
    mockedAxios.mockResolvedValueOnce({
      status: 200,
      statusText: "OK",
      headers: {
        "content-type": "application/json",
      },
      data: '{"ok":true}',
    });

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
    const mockedAxios = vi.mocked(axios);
    mockedAxios.mockRejectedValueOnce(new Error("axios exploded"));

    const result = await executeHttpRequest({
      method: "GET",
      url: "https://example.com",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorMessage).toBe("axios exploded");
      expect(result.method).toBe("GET");
    }
  });
});
