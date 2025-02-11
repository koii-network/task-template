import { initializeTaskManager } from "@_koii/task-manager";
import { setup } from "./task/0-setup.ts";
import { task } from "./task/1-task.ts";
import { submission } from "./task/2-submission.ts";
import { audit } from "./task/3-audit.ts";
import { distribution } from "./task/4-distribution.ts";
import { routes } from "./task/5-routes.ts";
initializeTaskManager({
  setup,
  task,
  submission,
  audit,
  distribution,
  routes,
});
