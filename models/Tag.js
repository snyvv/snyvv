const joi = require('joi');

module.exports = {
	tableName: 'tags',
	hasTimestamps: false,
	validate:{
		name: joi.string(),
		eng: joi.string()
	},
	portfolios: function(){
		return this.belongsToMany('Portfolio');
	}
}