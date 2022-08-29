exports.up = knex => knex.schema.createTable("notes", table => {
  table.increments('id')
  table.text('title')
  table.text('description')
  table.integer('rating')
  table.integer('user_id').references('id').inTable('users')
  table.time("created_at", { useTz: true }).default(knex.fn.now())
  table.time("updated_at", { useTz: true }).default(knex.fn.now())
})
  
exports.down = knex => knex.schema.dropTable("notes")
