import { performance } from "node:perf_hooks";

/**
 * A function to log the execution time of a code block.
 * Call this function at the start of the code block.
 * @returns a function to call at the end of a code block.
 */
export function tick() {
  const start = performance.now();
  return () => {
    const end = performance.now();
    const diff = (end - start) * 1e-3;
    console.debug(`Execution time: ${diff.toLocaleString()} seconds.`);
  };
}

/**
 * Log Node.js memory stats for analysis.
 */
export function logMemoryUsage() {
  const stats = process.memoryUsage();
  console.debug({
    heapUsedMB: Math.ceil(stats.heapUsed * 1e-6),
    heapTotalMB: Math.ceil(stats.heapTotal * 1e-6),
    rssMB: Math.ceil(stats.rss * 1e-6),
  });
}
