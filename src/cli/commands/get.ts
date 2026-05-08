import type { CommandHandlerInput } from "../../types/cli.js";
import { handleRequestCommand } from "./request.js";

export async function handleGetCommand(input: CommandHandlerInput): Promise<void> {
  await handleRequestCommand({
    method: "GET",
    url: input.url,
    headers: input.headers,
  });
}
