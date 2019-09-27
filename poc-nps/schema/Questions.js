cube(`Questions`, {
  sql: `SELECT * FROM questions`,

  measures: {
    type_count: {
      sql: `type`,
      type: `count`
    }
  },
  
  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true
    },
    
    type: {
      sql: `type`,
      type: `string`
    }
  }
});
