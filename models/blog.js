const joi = require('joi');

module.exports = {
	tableName: 'blog',
	hasTimestamps: true,
	validate:{
		title: joi.string(),
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