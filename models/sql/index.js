import Sequelize from 'sequelize';
import databaseConnection from '../../setup/databaseConnection';

const models = {
  User: databaseConnection.import('./users/users'),
  Post: databaseConnection.import('./posts/posts'),
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = databaseConnection;
models.Sequelize = Sequelize;

// associations
// models.Post.hasMany(models.Post);
// models.User.belongsTo(models.User);

export default models;
