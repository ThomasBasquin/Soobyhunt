const { Sequelize, DataTypes } = require('sequelize');

module.exports = sequelize => {

	class Group extends Sequelize.Model {

	}

	Group.init({
		title: {
			type: DataTypes.STRING,
		}
	}, {
		sequelize,
		modelName: 'Group'
	});

	return Group;
};
