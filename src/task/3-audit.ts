export async function audit(
  submission: string,
  roundNumber: number,
  submitterKey: string,
): Promise<boolean | void> {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber} from ${submitterKey}`);
  return submission === "Hello, World!";
}
