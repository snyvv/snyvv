const joi = require('joi');

module.exports = {
	tableName: 'portfolios',
	hasTimestamps: true,
	validate:{
		name: joi.string(),
		subname: joi.string(),
		contents: joi.string(),
		image: joi.string(),
    date: joi.string()
	},
	tags: function(){
		return this.belongsToMany('Tag');
	},
	comments: function(){
		return this.hasMany('Comment');
	}
}