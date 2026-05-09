import chalk from "chalk";
import type { HttpResult } from "../types/cli.js";

function formatStatus(status: number, statusText: string): string {
  const text = `${status} ${statusText}`;
  if (status >= 200 && status < 300) {
    return chalk.green(text);
  }
  if (status >= 400) {
    return chalk.red(text);
  }
  return chalk.yellow(text);
}

function formatBody(body: string): string {
  try {
    const parsed = JSON.parse(body);
    return JSON.stringify(parsed, null, 2);
  } catch {
    return body;
  }
}

export function printHttpResult(result: HttpResult, verbose: boolean = false): void {
  if (!result.ok) {
    printCliError(result.errorMessage);
    return;
  }

  console.log(chalk.cyan("ShellReq CLI"));
  console.log(`${chalk.bold("Method")}  ${result.method}`);
  console.log(`${chalk.bold("URL")}     ${result.url}`);
  console.log(`${chalk.bold("Status")}  ${formatStatus(result.response.status, result.response.statusText)}`);
  console.log(`${chalk.bold("Time")}    ${result.response.durationMs}ms`);
  
  if (verbose) {
    console.log(chalk.bold("Headers:"));
    for (const [key, value] of Object.entries(result.response.headers)) {
      console.log(`  ${chalk.gray(key)}: ${value}`);
    }
  } else {
    console.log(`${chalk.bold("Headers")} ${Object.keys(result.response.headers).length}`);
  }

  console.log(chalk.gray("Body:"));
  console.log(formatBody(result.response.body));
}

export function printCliError(message: string): void {
  console.error(chalk.red(`Error: ${message}`));
}
