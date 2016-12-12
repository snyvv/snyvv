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
	  searchAll: function(keyword){
	  	let models = require('./');
	  	return Promise.all([
	  		this.search(keyword),
	  		models.query(
	  		`
	  		SELECT portfolios.id,portfolios.name,portfolios.subname,portfolios.image, portfolios.contents, portfolios.date, tags.name as tag_name, tags.eng as tag_eng
			FROM (portfolios join portfolios_tags on portfolios.id = portfolios_tags.portfolio_id) join tags on portfolios_tags.tag_id = tags.id
	  		where portfolios.name like ? 
	  		or portfolios.subname like ? 
	  		or portfolios.contents like ?
	  		or DATE_FORMAT(portfolios.date, '%Y-%m-%d') LIKE ?
	  		or tags.name like ?
	  		or tags.eng like ?
	  		`
	  		,[`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`,
	  		`%${keyword}%`,])	  		
	  		]) 
	  	.then(result=>{
	  		var data = result[0][0].concat(result[1][0]);
	  		var ids = [];
	  		data.map(d=>{
	  			ids.push(d.id);
	  		});
	  		uniqueIds = ids.filter(function(item, pos) {
			    return ids.indexOf(item) == pos;
			});
	  		return Promise.resolve(uniqueIds);
	  	})
	  	.then(result =>{
	  		return models.Portfolio.forge()
	  				 .where('id', 'in', result)
	  				 .fetchAll({withRelated:['tags']});
	  	})
	  	.catch(err=>{
	  		console.log(err);
	  	});
	  	;
	  },
	}
}