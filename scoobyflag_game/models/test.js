import { Sequelize, DataTypes } from "sequelize";

export default (sequelize) => {
  class Group extends Sequelize.Model {}

  Group.init(
    {
      title: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "config",
    }
  );

  return Group;
};
