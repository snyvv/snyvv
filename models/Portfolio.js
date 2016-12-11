const joi = require('joi');

module.exports = {
	tableName: 'portfolios',
	hasTimestamps: true,
	validate:{
		name: joi.string(),
		subname: joi.string(),
		contents: joi.string(),
		image: joi.string(),
		recommend: joi.number(),
    date: joi.string()
	},
	tags: function(){
		return this.belongsToMany('Tag');
	},
	comments: function(){
		return this.hasMany('Comment');
	},
	methods:{

		search: function(keyword){

	  	let models = require('./');

	  	return models.transaction(t => {

	  			return models.Portfolio.query((q) => {
						  q.where('name', 'LIKE', '%'+keyword+'%')
						  .orWhere('subname', 'LIKE', '%'+keyword+'%')
						  .orWhere('contents', 'LIKE', '%'+keyword+'%');
						})
						.fetchAll({withRelated:['tags'] ,transacting:t});

	  	});
	  },
		searchAll: function(keyword){

	  	let models = require('./');
	  	return models.query(
	  		`select * from portfolios 
	  		where name like ? 
	  		or subname like ? 
	  		or contents like ?
	  		or DATE_FORMAT(date, '%Y-%m-%d') LIKE ?`
	  		,[`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`]);
	  },
		searchFind: function(keyword){

	  	let models = require('./');

	  	return models.query('select * from portfolios');
	  },
	}
}