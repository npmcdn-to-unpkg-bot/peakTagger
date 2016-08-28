exports.up = function(knex, Promise) {
  return knex.schema.createTable('peaks', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('osm_id').unique().notNullable();
    table.integer('ele');
    table.float('lat', 12, 8).notNullable();
    table.float('lon', 12, 8).notNullable();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('peaks');
};
