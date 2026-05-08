import type { Command } from "commander";
import { handleGetCommand } from "./commands/get.js";
import { handleRequestCommand } from "./commands/request.js";

interface RequestCommandOptions {
  header?: string[];
  json?: string;
}

function collectHeader(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

export function registerCommands(program: Command): void {
  program
    .command("get")
    .description("Execute a GET request")
    .argument("<url>", "target URL")
    .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, [])
    .action(async (url: string, options: RequestCommandOptions) => {
      await handleGetCommand({ url, headers: options.header });
    });

  program
    .command("post")
    .description("Execute a POST request")
    .argument("<url>", "target URL")
    .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, [])
    .option("-j, --json <json>", "JSON request body")
    .action(async (url: string, options: RequestCommandOptions) => {
      await handleRequestCommand({
        method: "POST",
        url,
        headers: options.header,
        jsonBody: options.json,
      });
    });

  program
    .command("put")
    .description("Execute a PUT request")
    .argument("<url>", "target URL")
    .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, [])
    .option("-j, --json <json>", "JSON request body")
    .action(async (url: string, options: RequestCommandOptions) => {
      await handleRequestCommand({
        method: "PUT",
        url,
        headers: options.header,
        jsonBody: options.json,
      });
    });

  program
    .command("patch")
    .description("Execute a PATCH request")
    .argument("<url>", "target URL")
    .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, [])
    .option("-j, --json <json>", "JSON request body")
    .action(async (url: string, options: RequestCommandOptions) => {
      await handleRequestCommand({
        method: "PATCH",
        url,
        headers: options.header,
        jsonBody: options.json,
      });
    });

  program
    .command("delete")
    .description("Execute a DELETE request")
    .argument("<url>", "target URL")
    .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, [])
    .action(async (url: string, options: RequestCommandOptions) => {
      await handleRequestCommand({ method: "DELETE", url, headers: options.header });
    });
}
