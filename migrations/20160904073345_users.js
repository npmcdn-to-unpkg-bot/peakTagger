exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.boolean('isAdmin').notNullable().defaultTo(false);
    table.boolean('useMetric').notNullable().defaultTo(false);
    table.boolean('ptPoints').notNullable().defaultTo(0);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
