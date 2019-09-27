cube(`Responses`, {
  sql: `SELECT * FROM responses`,
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    surveyableId: {
      sql: `surveyable_id`,
      type: `number`
    }
  }
});
