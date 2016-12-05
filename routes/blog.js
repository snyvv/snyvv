var express = require('express');
var router = express.Router();

/* get home */
router.get('/', (req, res, next)=>{
	res.render('blog',{
		title: "웹퍼블리셔 김신영",
		pageTitle: "블로그",
		pageName: "blog"
	});
});

module.exports = router;