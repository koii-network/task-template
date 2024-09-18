import { app } from '@_koii/namespace-wrapper';
import { setupRoutes } from '../routes.js';

export async function setup() {
  // define any steps that must be executed before the task starts
  console.log('CUSTOM SETUP');
  // you can define custom API routes in routes.js
  setupRoutes(app);
}
