export function parseTaskState(taskState) {
  taskState.stake_list = objectify(taskState.stake_list, true);
  taskState.ip_address_list = objectify(taskState.ip_address_list, true);
  taskState.distributions_audit_record = objectify(
    taskState.distributions_audit_record,
    true,
  );
  taskState.distributions_audit_trigger = objectify(
    taskState.distributions_audit_trigger,
    true,
  );
  taskState.submissions = objectify(taskState.submissions, true);
  taskState.submissions_audit_trigger = objectify(
    taskState.submissions_audit_trigger,
    true,
  );
  taskState.distribution_rewards_submission = objectify(
    taskState.distribution_rewards_submission,
    true,
  );
  taskState.available_balances = objectify(taskState.available_balances, true);
  return taskState;
}

function objectify(data, recursive = false) {
  if (data instanceof Map) {
    const obj = Object.fromEntries(data);
    if (recursive) {
      for (const key in obj) {
        if (obj[key] instanceof Map) {
          obj[key] = objectify(obj[key], true);
        } else if (typeof obj[key] === "object" && obj[key] !== null) {
          obj[key] = objectify(obj[key], true);
        }
      }
    }
    return obj;
  }
  return data;
}
