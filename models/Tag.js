const joi = require('joi');

module.exports = {
	tableName: 'tags',
	hasTimestamps: false,
	validate:{
		name: joi.string()
	},
	portfolios: function(){
		return this.belongsToMany('Portfolio');
	}
}