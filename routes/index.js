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
	models.Portfolio.searchAll(req.query.key)
	.then(data=>{
		console.log(data.toJSON());
		res.send('search Complete');
	})
	.catch(err=>{
		console.log(err);
		res.send('error');
	});

});

/*
sear
*/

module.exports = router;