import axios, { AxiosError } from "axios";
import type { HttpRequestInput, HttpResult } from "../types/cli.js";

export async function executeHttpRequest(input: HttpRequestInput): Promise<HttpResult> {
  const startedAt = Date.now();

  try {
    const response = await axios({
      method: input.method,
      url: input.url,
      data: input.body,
      headers: input.headers,
      timeout: 30000,
      // We want to handle non-2xx statuses ourselves to match the previous behavior
      validateStatus: () => true,
      // Get the response as a string to match previous behavior
      responseType: "text",
    });

    return {
      ok: true,
      method: input.method,
      url: input.url,
      response: {
        status: response.status,
        statusText: response.statusText,
        // Axios headers are an object or an AxiosHeaders instance
        headers: response.headers as Record<string, string>,
        body: response.data,
        durationMs: Date.now() - startedAt,
      },
    };
  } catch (error) {
    let errorMessage = "Unknown network error.";
    
    if (axios.isAxiosError(error)) {
      if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out (30s).";
      } else if (error.message) {
        errorMessage = error.message;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      ok: false,
      method: input.method,
      url: input.url,
      errorMessage,
    };
  }
}
