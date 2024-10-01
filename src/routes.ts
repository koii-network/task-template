import { namespaceWrapper } from "@_koii/namespace-wrapper";
import type { Express } from "express";

export function setupRoutes(app: Express) {
  if (app) {
    app.get("/value", async (_req, res) => {
      const value = await namespaceWrapper.storeGet("value");
      console.log("value", value);
      res.json({ value: value });
    });
  }
}
