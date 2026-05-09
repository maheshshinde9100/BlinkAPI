import { Command } from "commander";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { printCliError } from "../output/console.js";
import { getErrorMessage } from "../utils/errors.js";
import { registerCommands } from "./registerCommands.js";

dotenv.config({ quiet: true });

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "../../package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("shellreq")
    .description("Lightweight terminal-native API client")
    .version(pkg.version);

  registerCommands(program);

  // We only want exitOverride in test environments if needed, 
  // but for production CLI, letting it exit normally is better 
  // for --help and --version.
  // program.exitOverride(); 

  try {
    await program.parseAsync(argv, { from: "user" });
  } catch (error: any) {
    // If it's a commander error with a code like 'commander.helpDisplayed', we just return
    if (error.code?.startsWith("commander.")) {
      return;
    }
    printCliError(getErrorMessage(error, "Unknown CLI error."));
    process.exitCode = 1;
  }
}
