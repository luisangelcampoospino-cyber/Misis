type LogObj = Record<string, unknown>;

function format(level: string, obj: LogObj | string, msg?: string): string {
  const ts = new Date().toISOString();
  if (typeof obj === "string") return `[${ts}] [${level}] ${obj}`;
  return `[${ts}] [${level}] ${msg ?? ""} ${Object.keys(obj).length ? JSON.stringify(obj) : ""}`.trimEnd();
}

export const logger = {
  info: (obj: LogObj | string, msg?: string) => console.log(format("INFO", obj, msg)),
  warn: (obj: LogObj | string, msg?: string) => console.warn(format("WARN", obj, msg)),
  error: (obj: LogObj | string, msg?: string) => console.error(format("ERROR", obj, msg)),
  debug: (obj: LogObj | string, msg?: string) => console.debug(format("DEBUG", obj, msg)),
};
