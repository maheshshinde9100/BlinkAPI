import type { Command } from "commander";
import { handleGetCommand } from "./commands/get.js";

export function registerCommands(program: Command): void {
  program
    .command("get")
    .description("Prepare a GET request")
    .argument("<url>", "target URL")
    .action(async (url: string) => {
      await handleGetCommand({ url });
    });
}
