import { executeHttpRequest } from "../../http/client.js";
import { printCliError, printHttpResult } from "../../output/console.js";
import type { CommandExecutionContext } from "../../types/cli.js";
import { isLikelyUrl } from "../../utils/validators.js";

const METHODS_WITH_BODY = new Set(["POST", "PUT", "PATCH"]);

export async function handleRequestCommand(context: CommandExecutionContext): Promise<void> {
  if (!isLikelyUrl(context.url)) {
    printCliError("Please provide a valid http/https URL.");
    process.exitCode = 1;
    return;
  }

  const body = METHODS_WITH_BODY.has(context.method) ? context.body : undefined;
  const result = await executeHttpRequest({
    method: context.method,
    url: context.url,
    body,
  });

  printHttpResult(result);

  if (!result.ok) {
    process.exitCode = 1;
  }
}
