import type { Command } from "commander";
import { handleRequestCommand } from "./commands/request.js";
import { COMMAND_DEFINITIONS } from "./commandDefinitions.js";

interface RequestCommandOptions {
  header?: string[];
  json?: string;
  verbose?: boolean;
}

function collectHeader(value: string, previous: string[] = []): string[] {
  return [...previous, value];
}

export function registerCommands(program: Command): void {
  for (const definition of COMMAND_DEFINITIONS) {
    const command = program
      .command(definition.name)
      .description(definition.description)
      .argument("<url>", "target URL")
      .option("-H, --header <header>", "custom header in 'Key: Value' format", collectHeader, []);

    if (definition.supportsJsonBody) {
      command.option("-j, --json <json>", "JSON request body");
    }

    command.option("-v, --verbose", "show verbose output including response headers");

    command.action(async (url: string, options: RequestCommandOptions) => {
      await handleRequestCommand({
        method: definition.method,
        url,
        headers: options.header,
        jsonBody: options.json,
        verbose: options.verbose,
      });
    });
  }

  program
    .command("ui")
    .description("Launch terminal interactive UI")
    .action(async () => {
      const { launchTui } = await import("../ui/TuiLauncher.js");
      await launchTui();
    });
}
