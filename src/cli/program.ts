import { Command } from "commander";
import dotenv from "dotenv";
import { printCliError, printPlaceholderResponse } from "../output/console.js";
import type { CliContext } from "../types/cli.js";
import { isLikelyUrl } from "../utils/validators.js";
import { executePlaceholderRequest } from "../http/client.js";

dotenv.config({ quiet: true });

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("fetchup")
    .description("Lightweight terminal-native API client")
    .version("0.1.0");

  program
    .command("get")
    .description("Prepare a GET request")
    .argument("<url>", "target URL")
    .action(async (url: string) => {
      if (!isLikelyUrl(url)) {
        printCliError("Please provide a valid http/https URL.");
        process.exitCode = 1;
        return;
      }

      const context: CliContext = {
        command: "get",
        url,
      };

      const result = await executePlaceholderRequest(context);
      printPlaceholderResponse(result);
    });

  program.exitOverride();

  try {
    await program.parseAsync(argv, { from: "user" });
  } catch (error) {
    printCliError(error instanceof Error ? error.message : "Unknown CLI error.");
    process.exitCode = 1;
  }
}
