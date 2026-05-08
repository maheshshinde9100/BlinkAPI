import type { Command } from "commander";
import { handleGetCommand } from "./commands/get.js";
import { handleRequestCommand } from "./commands/request.js";

export function registerCommands(program: Command): void {
  program
    .command("get")
    .description("Execute a GET request")
    .argument("<url>", "target URL")
    .action(async (url: string) => {
      await handleGetCommand({ url });
    });

  program
    .command("post")
    .description("Execute a POST request")
    .argument("<url>", "target URL")
    .option("-b, --body <body>", "request body as raw string")
    .action(async (url: string, options: { body?: string }) => {
      await handleRequestCommand({ method: "POST", url, body: options.body });
    });

  program
    .command("put")
    .description("Execute a PUT request")
    .argument("<url>", "target URL")
    .option("-b, --body <body>", "request body as raw string")
    .action(async (url: string, options: { body?: string }) => {
      await handleRequestCommand({ method: "PUT", url, body: options.body });
    });

  program
    .command("patch")
    .description("Execute a PATCH request")
    .argument("<url>", "target URL")
    .option("-b, --body <body>", "request body as raw string")
    .action(async (url: string, options: { body?: string }) => {
      await handleRequestCommand({ method: "PATCH", url, body: options.body });
    });

  program
    .command("delete")
    .description("Execute a DELETE request")
    .argument("<url>", "target URL")
    .action(async (url: string) => {
      await handleRequestCommand({ method: "DELETE", url });
    });
}
