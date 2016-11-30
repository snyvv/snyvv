const joi = require('joi');

module.exports = {
	tableName: 'contacts',
	hasTimestamps: true,
	validate:{
		category: joi.string().allow('site','work','etc'),
		name: joi.string().regex(/^[a-zA-Z가-힣]{2,20}$/),
		email: joi.string().email(),
		contents: joi.string()
	}
}