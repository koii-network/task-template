import { namespaceWrapper } from "@_koii/namespace-wrapper";

export async function task(roundNumber: number): Promise<void> {
  // Run your task and store the proofs to be submitted for auditing
  // The submission of the proofs is done in the submission function
  try {
    console.log(`EXECUTE TASK FOR ROUND ${roundNumber}`);
    // you can optionally return this value to be used in debugging
    await namespaceWrapper.storeSet("value", "Hello, World!");
  } catch (error) {
    console.error("EXECUTE TASK ERROR:", error);
  }
}
