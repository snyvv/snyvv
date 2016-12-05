const joi = require('joi');

module.exports = {
	tableName: 'blogs',
	hasTimestamps: true,
	validate:{
		title: joi.string(),
		category: joi.string(),
		contents: joi.string(),
    date: joi.string()
	},
	tags: function(){
		return this.belongsToMany('Tag');
	},
	comments: function(){
		return this.hasMany('Comment');
	}
}