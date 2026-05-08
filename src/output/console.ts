import chalk from "chalk";
import type { HttpResult } from "../types/cli.js";

export function printHttpResult(result: HttpResult): void {
  if (!result.ok) {
    printCliError(result.errorMessage);
    return;
  }

  console.log(chalk.cyan("FetchUp CLI"));
  console.log(`${chalk.bold("Method")}  ${result.method}`);
  console.log(`${chalk.bold("URL")}     ${result.url}`);
  console.log(`${chalk.bold("Status")}  ${result.response.status} ${result.response.statusText}`);
  console.log(`${chalk.bold("Headers")} ${Object.keys(result.response.headers).length}`);
  console.log(chalk.gray("Body:"));
  console.log(result.response.body);
}

export function printCliError(message: string): void {
  console.error(chalk.red(`Error: ${message}`));
}
