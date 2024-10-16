import { initializeTaskManager } from "@_koii/task-manager";
// any custom setup logic you need
import { setup } from "./task/0-setup.js";

// your task, submission, and audit logic
import { task } from "./task/1-task.js";
import { submission } from "./task/2-submission.js";
import { audit } from "./task/3-audit.js";

// rewards calculation
import { distribution } from "./task/4-distribution.js";

// custom REST API routes
import { routes } from "./task/5-routes.js";

initializeTaskManager({
  setup,
  task,
  submission,
  audit,
  distribution,
  routes,
});
