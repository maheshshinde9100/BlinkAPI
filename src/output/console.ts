import chalk from "chalk";
import type { CliContext } from "../types/cli.js";

export function printPlaceholderResponse(context: CliContext): void {
  console.log(chalk.cyan("FetchUp CLI"));
  console.log(chalk.gray("Command recognized successfully."));
  console.log(`${chalk.bold("Method")}  ${context.command.toUpperCase()}`);
  console.log(`${chalk.bold("URL")}     ${context.url}`);
  console.log(chalk.yellow("HTTP execution will be added in the next branch."));
}

export function printCliError(message: string): void {
  console.error(chalk.red(`Error: ${message}`));
}
