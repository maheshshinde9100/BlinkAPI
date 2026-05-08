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

  const normalizedInput = unwrapWrappedQuotes(jsonBody.trim());

  try {
    const parsed = JSON.parse(normalizedInput);
    return JSON.stringify(parsed);
  } catch {
    const fallback = tryParseLooseObject(normalizedInput);
    if (fallback !== undefined) {
      return JSON.stringify(fallback);
    }

    throw new Error("Invalid JSON body. Please provide a valid JSON string.");
  }
}

function unwrapWrappedQuotes(input: string): string {
  if (
    (input.startsWith('"') && input.endsWith('"')) ||
    (input.startsWith("'") && input.endsWith("'"))
  ) {
    return input.slice(1, -1);
  }

  return input;
}

function parseLooseValue(rawValue: string): unknown {
  const value = rawValue.trim();
  if (!value) {
    return "";
  }

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === "null") {
    return null;
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue)) {
    return numericValue;
  }

  return value;
}

function tryParseLooseObject(input: string): Record<string, unknown> | undefined {
  const trimmed = input.trim();
  const hasBraces = trimmed.startsWith("{") && trimmed.endsWith("}");
  const body = hasBraces ? trimmed.slice(1, -1).trim() : trimmed;
  if (!body) {
    return {};
  }

  const result: Record<string, unknown> = {};
  const parts = body.split(",");

  for (const part of parts) {
    const separatorIndex = part.indexOf(":");
    if (separatorIndex === -1) {
      return undefined;
    }

    const rawKey = part.slice(0, separatorIndex).trim();
    const rawValue = part.slice(separatorIndex + 1).trim();

    const key = rawKey.replace(/^['"]|['"]$/g, "").trim();
    if (!key) {
      return undefined;
    }

    result[key] = parseLooseValue(rawValue);
  }

  return result;
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
