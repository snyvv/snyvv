const joi = require('joi');

module.exports = {
	tableName: 'tags',
	hasTimestamps: true,
	validate:{
		name: joi.string(),
		contetns: joi.string()
	},
	tags: function(){
		return this.belongsToMany('Tag');
	},
	comments: function(){
		return this.hasMany('Comment');
	}
}