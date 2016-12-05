var express = require('express');
var router = express.Router();

/* get home */
router.get('/', (req, res, next)=>{
	res.render('index',{
		title: "웹퍼블리셔 김신영",
		pageTitle: "홈",
		pageName: "main"
	});
});

router.post('/' (req, res, next)=>{
	res.render('search',{
		title: "keyword+ 검색결과 | 웹퍼블리셔 김신영",
		pageTitle: "keyword 검색결과",
		pageName: "search"
	});
});

module.exports = router;