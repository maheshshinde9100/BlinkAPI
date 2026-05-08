export type SupportedCommand = "get";

export interface CliContext {
  command: SupportedCommand;
  url: string;
}
