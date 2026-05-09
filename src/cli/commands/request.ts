import { executeHttpRequest } from "../../http/client.js";
import { resolveUrlWithEnv } from "../../env/resolver.js";
import { printCliError, printHttpResult } from "../../output/console.js";
import type { CommandExecutionContext } from "../../types/cli.js";
import { getErrorMessage } from "../../utils/errors.js";
import { parseRequestOptions } from "../../utils/requestOptions.js";
import { isLikelyUrl } from "../../utils/validators.js";

export async function handleRequestCommand(context: CommandExecutionContext): Promise<void> {
  let resolvedUrl: string;
  try {
    resolvedUrl = resolveUrlWithEnv(context.url);
  } catch (error) {
    printCliError(getErrorMessage(error, "Failed to resolve environment variables."));
    process.exitCode = 1;
    return;
  }

  if (!isLikelyUrl(resolvedUrl)) {
    printCliError("Please provide a valid http/https URL.");
    process.exitCode = 1;
    return;
  }

  let options;
  try {
    options = parseRequestOptions({
      method: context.method,
      headerInputs: context.headers,
      jsonBody: context.jsonBody,
    });
  } catch (error) {
    printCliError(getErrorMessage(error, "Invalid request options."));
    process.exitCode = 1;
    return;
  }

  const result = await executeHttpRequest({
    method: context.method,
    url: resolvedUrl,
    body: options.body,
    headers: options.headers,
  });

  printHttpResult(result, context.verbose);

  if (!result.ok) {
    process.exitCode = 1;
  }
}
