import { namespaceWrapper, app } from "@_koii/task-manager/namespace-wrapper";

export async function routes() {
  /**
   *
   * Define all your custom routes here
   *
   */

  // Example route
  app.get("/value", async (_req, res) => {
    const value = await namespaceWrapper.storeGet("value");
    console.log("value", value);
    res.status(200).json({ value: value });
  });
}
