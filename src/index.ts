import { initializeTaskManager } from "@_koii/task-manager";
import { setup } from "./task/0-setup";
import { task } from "./task/1-task";
import { submission } from "./task/2-submission";
import { audit } from "./task/3-audit";
import { distribution } from "./task/4-distribution";
import { routes } from "./task/5-routes";
initializeTaskManager({
  setup,
  task,
  submission,
  audit,
  distribution,
  routes,
});
