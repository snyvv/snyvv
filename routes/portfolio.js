var express = require('express');
var router = express.Router();
var models = require('../models');
var moment = require('moment');

/* get portfolio */
router.get('/', (req, res, next)=>{
	var tags = [];
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
			res.render('portfolio',{
				title: "포트폴리오 | 웹퍼블리셔 김신영",
				pageTitle: "포트폴리오",
				pageName: "portfolio",
				portfolios: result
			});
		});
	});
});

<<<<<<< HEAD
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
		return data.name == tag || data.eng == tag;
	});
	if (result.length == 0)
		return false;
	else
		return true;
}

=======
>>>>>>> 2d2fd622cb8bba53f38f1e660ba2d878d8f00ce5
router.get('/:name',(req,res,next)=>{
	models.Portfolio.findOne({name:req.params.name}).then(data=>{
		res.render('portfolio_view',{
			title: req.params.name+" - 포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: "포트폴리오",
			pageName: "portfolio",
			data : data
		});
	});
});

module.exports = router;