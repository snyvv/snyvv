const joi = require('joi');

module.exports = {
	tableName: 'comments',
	hasTimestamps: true,
	validate:{
		name: joi.string().regex(/^[a-zA-Z가-힣]{2,20}$/),
		password: joi.string().min(8).max(20),
		email: joi.string().email()
	}
}