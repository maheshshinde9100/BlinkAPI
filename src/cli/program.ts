import { Command } from "commander";
import dotenv from "dotenv";
import { printCliError } from "../output/console.js";
import { getErrorMessage } from "../utils/errors.js";
import { registerCommands } from "./registerCommands.js";

dotenv.config({ quiet: true });

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("shellreq")
    .description("Lightweight terminal-native API client")
    .version("1.0.0");

  registerCommands(program);

  program.exitOverride();

  try {
    await program.parseAsync(argv, { from: "user" });
  } catch (error) {
    printCliError(getErrorMessage(error, "Unknown CLI error."));
    process.exitCode = 1;
  }
}
