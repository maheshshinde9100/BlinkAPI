import { executePlaceholderRequest } from "../../http/client.js";
import { printCliError, printPlaceholderResponse } from "../../output/console.js";
import type { CliContext, CommandHandlerInput } from "../../types/cli.js";
import { isLikelyUrl } from "../../utils/validators.js";

export async function handleGetCommand(input: CommandHandlerInput): Promise<void> {
  if (!isLikelyUrl(input.url)) {
    printCliError("Please provide a valid http/https URL.");
    process.exitCode = 1;
    return;
  }

  const context: CliContext = {
    command: "get",
    url: input.url,
  };

  const result = await executePlaceholderRequest(context);
  printPlaceholderResponse(result);
}
