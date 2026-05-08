import type { HttpMethod } from "../types/cli.js";

export interface CommandDefinition {
  name: "get" | "post" | "put" | "patch" | "delete";
  method: HttpMethod;
  description: string;
  supportsJsonBody: boolean;
}

export const COMMAND_DEFINITIONS: CommandDefinition[] = [
  {
    name: "get",
    method: "GET",
    description: "Execute a GET request",
    supportsJsonBody: false,
  },
  {
    name: "post",
    method: "POST",
    description: "Execute a POST request",
    supportsJsonBody: true,
  },
  {
    name: "put",
    method: "PUT",
    description: "Execute a PUT request",
    supportsJsonBody: true,
  },
  {
    name: "patch",
    method: "PATCH",
    description: "Execute a PATCH request",
    supportsJsonBody: true,
  },
  {
    name: "delete",
    method: "DELETE",
    description: "Execute a DELETE request",
    supportsJsonBody: false,
  },
];
