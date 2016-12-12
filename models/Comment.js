const joi = require('joi');

module.exports = {
	tableName: 'comments',
	hasTimestamps: true,
	validate:{
		name: joi.string().regex(/^[a-zA-Z가-힣]{2,20}$/),
		password: joi.string().min(8).max(20),
		comments: joi.string(),
		date: joi.string(),
		portfolio_id: joi.number(),
		blog_id: joi.number()
	}/*,
	method:{
		getRecent : function(){
			var models = require('./');
			return models.Comment.orderBy('-updated_at').limit(5).fetchAll();
		}
	}*/
}