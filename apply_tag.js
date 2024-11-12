const entities = require('@jetbrains/youtrack-scripting-api/entities');

exports.rule = entities.Issue.onSchedule({
  title: 'Apply Overdue Tag to Unresolved Tickets',
  search: '#Unresolved has: {Due Date} tag: -OVERDUE',
  cron: '0 0 7 * * ?',
  muteUpdateNotifications: true,
  modifyUpdatedProperties: false,
  guard: (ctx) => {
    // Inspecting all fields in the project
    const dueDateField = ctx.issue.project.fields.find(field => field.name === 'Due Date');
    
    // If the Due Date field is found, set fieldValue
    if (dueDateField) {
      const fieldValue = ctx.issue.fields[dueDateField.name]; // Get the Due Date field value

      // Check if the Due Date is in the past
      return fieldValue && new Date(fieldValue) < new Date(); // Ensure fieldValue is defined and check if it's overdue
    }
    
    return false; // If Due Date field not found, return false
  },
  action: (ctx) => {
    const issue = ctx.issue;
    /* // You can uncomment this for debugging.
    let nowTime = Date.now();
    console.log(" =============================================== ");
    console.log("RUNNING for issue ID: " + issue.id);
    console.log("Current Time (nowTime): " + new Date(nowTime).toISOString());
    console.log(" =============================================== ");
    */
    issue.addTag('OVERDUE');
    console.log("ADDING TAG to issue: " + issue.id);   
  },
});