export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type SupportedCommand = "get" | "post" | "put" | "patch" | "delete";

export interface CliContext {
  command: SupportedCommand;
  url: string;
  body?: string;
}

export interface CommandHandlerInput {
  url: string;
  headers?: string[];
}

export interface HttpRequestInput {
  method: HttpMethod;
  url: string;
  body?: string;
  headers?: Record<string, string>;
}

export interface HttpResponseData {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
}

export interface HttpSuccessResult {
  ok: true;
  method: HttpMethod;
  url: string;
  response: HttpResponseData;
}

export interface HttpFailureResult {
  ok: false;
  method: HttpMethod;
  url: string;
  errorMessage: string;
}

export type HttpResult = HttpSuccessResult | HttpFailureResult;

export interface CommandExecutionContext {
  method: HttpMethod;
  url: string;
  headers?: string[];
  jsonBody?: string;
  verbose?: boolean;
}
