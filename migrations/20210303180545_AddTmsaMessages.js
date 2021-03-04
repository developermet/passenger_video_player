
exports.up = function(knex) {
  return knex.schema.createTable('tmsa_messages', tbl => {
    tbl.increments()
    tbl.string('content', 256)
    tbl.timestamps(true, true)
  })
};  

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tmsa_messages')
};
