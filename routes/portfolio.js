var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require('moment');
var marked = require('marked');

/* get portfolio */
router.get('/', (req, res, next)=>{
	var tags = [];
	var current = parseInt(moment().format('YYYY'));
	var years = [];
	for(var i = 2011;i<=current;i++)
		years.push(i);

	if(req.query.tag){
		// tags is array
		tags = (req.query.tag).split(',');
		tags = tags.filter(tag => {return tag != ' ' && tag != '';});
	}

	models.Portfolio.fetchAll({withRelated: ['tags']})
	.then(datas=>{		
		//console.log(datas.serialize()[0].tags);
		var result = datas.serialize().filter(data => {
			var hasTag = true;
			//console.log(data.tags);
			//tags = 사용자가 검색요청한 태그
			tags.forEach(tag => {
				//datas.tags = 포트폴리오의 태그
				if(! searchTag(tag, data.tags)){
					hasTag = false;
				}
			});
			return searchContents(data.contents, req.query.keyword)
				&& searchDate(data.date, req.query.year)
				&& hasTag;			
		});		
		models.Portfolio.fetchAll({withRelated:['tags']}).then(datas=>{
			res.render('portfolio/list',{
				title: "포트폴리오 | 웹퍼블리셔 김신영",
				pageTitle: "포트폴리오",
				pageName: "portfolio",
				menu: 2,
				portfolios: result,
				years: years
			});
		});
	});
});

function searchContents(contents,keyword){
	if(!!keyword){
		return contents.match(keyword);
	}
	else 
		return true;
}

function searchDate(date,year){
	if(!!year){
		if(year == 'all')
			return true;

		return moment(date).format('YYYY').match(year);
	} else{
		return true;
	}
}

function searchTag(tag,tags){
	var result = tags.filter(data =>{
		return data.name == tag || data.eng.match(tag);
	});
	if (result.length == 0)
		return false;
	else
		return true;
}

// tag
router.get('/tags',(req,res)=>{
	models.Tag.findAll().then(data=>{
		var tags = [];
		data.toJSON().forEach(tag=>{
			tags.push(tag.name);
		});
		res.json({tags:tags});
	});
});

// get view
router.get('/:name',(req,res,next)=>{
	models.Portfolio.where('name',req.params.name).fetch({withRelated:['tags']}).then(datas=>{
		var data = datas.toJSON();
		// marked로 해석해주기
		data.contents = marked(data.contents);
		res.render('portfolio/view',{
			title: req.params.name+" - 포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: req.params.name,
			pageName: "portfolio",
			data: data
		});
	})
	.catch(next);
});

// 추천수를 증가시킨다.
router.post('/recommend/:name',(req,res)=>{
	models.Portfolio.where('name',req.params.name).fetch()
	.then(data=>{
		console.log(data.get('recommend'));
		console.log(typeof data.get('recommend'));
		return models.Portfolio.update({recommend:data.get('recommend')+1},{id:data.get('id')});
	})
	.then(data=>{
		res.json({status:200}).end();
	})
	.catch(err=>{
		console.log(err);
		res.json({status:500}).end();
	});
});

// post comment
router.post('/:name',(req,res,next)=>{
	//models.Comment
});

module.exports = router;