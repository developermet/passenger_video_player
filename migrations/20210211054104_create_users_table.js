exports.up = function(knex) {
	return knex.schema.createTable('users', tbl => {
		  tbl.increments()
		  tbl.string('traveler_kind', 20).index()
		  tbl.string('stratum', 20).index()
		  tbl.string('age', 20).index()
		  tbl.string('gender', 20)
		  tbl.string('busId', 20).index()
			tbl.string('routeId', 20).index()
			tbl.string('firstEmgVal', 256)
			tbl.string('secondEmgVal', 256)
		  tbl.timestamps(true, true)
	  }).createTable('locations', tbl => {
		  tbl.increments()
		  tbl.datetime('messageTime', { precision: 6 }).index()
		  tbl.float("lat")
		  tbl.float("lon")
		  tbl.float("speed") 
		  tbl.string('busId', 20)
			tbl.string('routeId', 20).index()
			tbl.string('firstEmgVal', 256)
		  tbl.timestamps(true, true)
	  }).createTable('tmsa_messages', tbl => {
			tbl.increments()
			tbl.datetime('broadcastdate', { precision: 6 }).index()
			tbl.string('content', 256)
			tbl.string('firstEmgVal', 256)
			tbl.timestamps(true, true)
		})
};
  
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users').dropTableIfExists('locations').dropTableIfExists('tmsa_messages')
};