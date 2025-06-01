/**
 * Logs message (and other params) only if the script is running in debug mode.
 * 
 * @param message - the message to log
 * @param optionalParams - anything else to log alongside the message
 */
export function debug(message: any, ...optionalParams: any[]) {
  if (process.env["MODE"]?.toLowerCase() === "debug") {
    console.debug(message, ...optionalParams);
  }
}

/**
 * Calls a function only if the script is running in debug mode.
 * 
 * @param fn - the function to call
 */
export function debugOnly(fn: () => void) {
  if (process.env["MODE"]?.toLowerCase() === "debug") {
    fn();
  }
}
