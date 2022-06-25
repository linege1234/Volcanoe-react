// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      database: 'volcanoes',
      user: 'root',
      password: 'Cab230!',
      timezone: '+00:00'
    },
};
