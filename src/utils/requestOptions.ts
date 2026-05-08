import type { HttpMethod } from "../types/cli.js";

const METHODS_WITH_BODY = new Set<HttpMethod>(["POST", "PUT", "PATCH"]);

export interface ParsedRequestOptions {
  headers: Record<string, string>;
  body?: string;
}

function parseHeaderEntry(header: string): [string, string] {
  const separatorIndex = header.indexOf(":");
  if (separatorIndex === -1) {
    throw new Error(`Invalid header format "${header}". Use "Key: Value".`);
  }

  const key = header.slice(0, separatorIndex).trim();
  const value = header.slice(separatorIndex + 1).trim();

  if (!key) {
    throw new Error(`Invalid header format "${header}". Header key is missing.`);
  }

  return [key, value];
}

function parseHeaders(headerInputs?: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};

  for (const rawHeader of headerInputs ?? []) {
    const [key, value] = parseHeaderEntry(rawHeader);
    parsed[key] = value;
  }

  return parsed;
}

function parseJsonBody(jsonBody?: string): string | undefined {
  if (jsonBody === undefined) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(jsonBody);
    return JSON.stringify(parsed);
  } catch {
    throw new Error("Invalid JSON body. Please provide a valid JSON string.");
  }
}

export function parseRequestOptions(input: {
  method: HttpMethod;
  headerInputs?: string[];
  jsonBody?: string;
}): ParsedRequestOptions {
  const userHeaders = parseHeaders(input.headerInputs);
  const normalizedBody = parseJsonBody(input.jsonBody);
  const allowBody = METHODS_WITH_BODY.has(input.method);

  if (!allowBody && normalizedBody !== undefined) {
    throw new Error(`${input.method} does not support a request body.`);
  }

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json, text/plain, */*",
  };

  const headers = {
    ...defaultHeaders,
    ...userHeaders,
  };

  if (normalizedBody !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return {
    headers,
    body: allowBody ? normalizedBody : undefined,
  };
}
