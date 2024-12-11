import { namespaceWrapper, app } from "@_koii/namespace-wrapper";
/**
 * 
 * Define all your custom routes here
 * 
 */

//Example route 
export async function routes() {
  app.get("/value", async (_req, res) => {
    const value = await namespaceWrapper.storeGet("value");
    console.log("value", value);
    res.status(200).json({ value: value });
  });
}
