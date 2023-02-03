const
	fs = require('fs'),
	{ Sequelize } = require('sequelize');

// create Sequelize instance
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('scoobyFlagGame', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

const db = {};

fs.readdirSync(__dirname)
	.filter(filename => filename !== 'index.js')
	.forEach(filename => {
		const model = require('./' + filename)(sequelize);
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	db[modelName].associate(db);
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

sequelize.sync();

module.exports = db;
