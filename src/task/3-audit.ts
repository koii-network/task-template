export async function audit(
  submission: string,
  roundNumber: number,
): Promise<boolean | void> {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   * If the function throws an error or returns void, the submission will be considered correct
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);
  return submission === "Hello, World!";
}
