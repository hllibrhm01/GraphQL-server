import { Sequelize } from 'sequelize';
import env from '../config/env';
import databaseConfig from '../config/database.json';

// Load database config
const databaseConfigEnv = databaseConfig[env];

// Create new database connection
const connection = new Sequelize(
  databaseConfigEnv.database,
  databaseConfigEnv.username,
  databaseConfigEnv.password,
  {
    host: databaseConfigEnv.host,
    dialect: databaseConfigEnv.dialect,
  },
);
connection
  .authenticate()
  .then(() => console.info('INFO - Database connected.'))
  .catch((err) => console.error('ERROR - Unable to connect to the database:', err));

export default connection;
