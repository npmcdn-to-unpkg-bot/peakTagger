exports.up = function(knex, Promise) {
  return knex.schema.createTable('peaks', function(table) {
    table.increments('id').primary();
    table.bigInteger('osm_id').unique().notNullable();
    table.string('name').notNullable();
    table.integer('ele');
    table.string('lat').notNullable();
    table.string('lon').notNullable();
    table.string('county');
    table.string('state/country');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('peaks');
};
