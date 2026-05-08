const ENV_PLACEHOLDER_REGEX = /\{\{([A-Z0-9_]+)\}\}/gi;

export function resolveUrlWithEnv(rawUrl: string): string {
  const missingKeys: string[] = [];

  const resolved = rawUrl.replace(ENV_PLACEHOLDER_REGEX, (_full, key: string) => {
    const value = process.env[key];
    if (value === undefined) {
      missingKeys.push(key);
      return "";
    }

    return value;
  });

  if (missingKeys.length > 0) {
    throw new Error(`Missing environment variable(s): ${missingKeys.join(", ")}`);
  }

  return resolved;
}
