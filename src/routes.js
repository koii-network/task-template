import { namespaceWrapper } from "@_koii/namespace-wrapper";

export function setupRoutes(app) {
  if (app) {
    app.get("/value", async (_req, res) => {
      const value = await namespaceWrapper.storeGet("value");
      console.log("value", value);
      res.status(200).json({ value: value });
    });
  }
}
