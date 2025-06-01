import { realpath } from "node:fs/promises";

/**
 *
 * @param filepath the relative path of the file to load
 * @param throwError when true, throws error if file does not exist, otherwise returns null
 * @returns the full path of the file to load
 */
export async function filepath<ThrowError extends boolean>(
  filepath: string,
  throwError: ThrowError,
): Promise<ThrowError extends true ? string : string | null> {
  try {
    return await realpath(filepath);
  } catch {
    if (throwError) {
      throw new Error(`File does not exist: ${filepath}`);
    } else {
      return null as ThrowError extends true ? string : string | null;
    }
  }
}
