export default (sequelize, DataTypes) => sequelize.define('posts', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    required: true,
  },
  users_uuid: {
    type: DataTypes.UUID,
    required: true,
    allowNull: false,
    references: {
      model: 'users',
      key: 'uuid',
    },
  },
  post_title: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  post: {
    type: DataTypes.STRING,
    required: true,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  },
});
