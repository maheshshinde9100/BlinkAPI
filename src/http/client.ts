import type { HttpRequestInput, HttpResult } from "../types/cli.js";

function buildHeaderMap(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

export async function executeHttpRequest(input: HttpRequestInput): Promise<HttpResult> {
  try {
    const response = await fetch(input.url, {
      method: input.method,
      body: input.body,
    });

    return {
      ok: true,
      method: input.method,
      url: input.url,
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: buildHeaderMap(response.headers),
        body: await response.text(),
      },
    };
  } catch (error) {
    return {
      ok: false,
      method: input.method,
      url: input.url,
      errorMessage: error instanceof Error ? error.message : "Unknown network error.",
    };
  }
}
