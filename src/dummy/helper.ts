/**
 * Simulates network latency for dummy API calls.
 */
export async function simulateDelay(ms: number = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
