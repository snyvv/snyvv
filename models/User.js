const joi = require('joi');

module.exports = {
	tableName: 'users',
	hasTimestamps: true,
	validate:{
		uid: joi.string().min(5).max(15),
		name: joi.string().regex(/^[a-zA-Z가-힣]{2,20}$/),
		password: joi.string().min(8).max(20),
		email: joi.string().email()
	},
	portfolios: function(){
		return this.hasMany('Portfolio');
	},
	comments: function(){
		return this.hasMany('Comment');
	}
}