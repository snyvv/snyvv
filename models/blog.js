const joi = require('joi');

module.exports = {
	tableName: 'blogs',
	hasTimestamps: true,
	validate:{
		title: joi.string(),
		category: joi.string(),
		contents: joi.string(),
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
	  		`select * from blogs
	  		where title like ? 
	  		or category like ? 
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
	  		SELECT blogs.id,blogs.title,blogs.category, blogs.contents, blogs.date, tags.name as tag_name, tags.eng as tag_eng
			FROM (blogs join blogs_tags on blogs.id = blogs_tags.blog_id) join tags on blogs_tags.tag_id = tags.id
	  		where blogs.title like ? 
	  		or blogs.category like ? 
	  		or blogs.contents like ?
	  		or DATE_FORMAT(blogs.date, '%Y-%m-%d') LIKE ?
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
	  		return models.Blog.forge()
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