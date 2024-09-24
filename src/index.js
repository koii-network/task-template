import { initializeTaskManager } from '@_koii/task-manager';
import { setup } from './task/0-setup.js';
import { task } from './task/1-task.js';
import { submission } from './task/2-submission.js';
import { audit } from './task/3-audit.js';
import { distribution } from './task/4-distribution.js';

initializeTaskManager({
  setup,
  task,
  submission,
  audit,
  distribution,
});
