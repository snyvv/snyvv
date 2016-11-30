const joi = require('joi');

module.exports = {
	tableName: 'portfolios',
	hasTimestamps: true,
	validate:{
		name: joi.string(),
		contents: joi.string(),
		image: joi.string(),
    user_id : joi.number(),
    date: joi.string()
	},
	tags: function(){
		return this.belongsToMany('Tag');
	},
	comments: function(){
		return this.hasMany('Comment');
	}
}