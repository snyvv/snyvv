var express = require('express');
var router = express.Router();
var models = require('../models');

/* get home */
router.get('/', (req, res, next)=>{
	res.render('index',{
		title: "웹퍼블리셔 김신영",
		pageTitle: "홈",
		pageName: "main"
	});
});

router.post('/', (req, res, next)=>{
	res.render('search',{
		title: "keyword+ 검색결과 | 웹퍼블리셔 김신영",
		pageTitle: "keyword 검색결과",
		pageName: "search"
	});
});

router.get('/search',(req,res,next)=>{
	Promise.all([
		models.Portfolio.searchAll(req.query.search),
		models.Blog.searchAll(req.query.search)
	])
	.then(result=>{
		var portfolios = result[0].toJSON();
		var blogs = result[1].toJSON();

		res.render('common/search',{
			title: "keyword+ 검색결과 | 웹퍼블리셔 김신영",
			pageTitle: "keyword 검색결과",
			pageName: "search",
			searchCount : portfolios.length + blogs.length,
			portfolios : portfolios,
			blogs : blogs,
		});
	})
	.catch(next);
});

/*
sear
*/

module.exports = router;