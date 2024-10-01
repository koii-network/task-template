export async function audit(submission, roundNumber) {
  /**
   * Audit a submission
   * This function should return true if the submission is correct, false otherwise
   */
  console.log(`AUDIT SUBMISSION FOR ROUND ${roundNumber}`);
  return submission === 'Hello, World!';
}
