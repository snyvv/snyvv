var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require('moment');

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


router.get('/tags',(req,res)=>{
	models.Tag.findAll().then(data=>{
		var tags = [];
		data.toJSON().forEach(tag=>{
			tags.push(tag.name);
		});
		res.json({tags:tags});
	});
});

router.get('/:name',(req,res,next)=>{
	models.Portfolio.fetchAll({withRelated:['tags']}).then(datas=>{
		//console.log(datas.toJSON());
		res.render('portfolio/view',{
			title: req.params.name+" - 포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: req.params.name,
			pageName: "portfolio",
			portfolios: datas.toJSON()
		});
	});
});


module.exports = router;