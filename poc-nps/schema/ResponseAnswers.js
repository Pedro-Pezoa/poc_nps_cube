cube(`ResponseAnswers`, {
  sql: `SELECT * FROM response_answers`,
  
  joins: {
    Questions: {
      relationship: `hasMany`,
      sql: `${Questions}.id = ${ResponseAnswers}.question_id`
    },

    Responses: {
      relationship: `hasMany`,
      sql: `${Responses}.id = ${ResponseAnswers}.response_id`
    }
  },
  
  measures: {
    total: {
      type: `count`,
      sql: `value`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    value: {
      sql: `value`,
      type: `number`
    },

    createdAt: {
      sql: `created_at`,
      type: `time`
    }
  }
});
