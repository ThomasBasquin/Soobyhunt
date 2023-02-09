const group_ctrl = require('../controllers/group');

module.exports = [
	{
		url: '/test',
		method: 'get',
		func: group_ctrl.test
	}
];
