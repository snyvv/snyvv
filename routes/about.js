var express = require('express');
var router = express.Router();

/* get about */
router.get('/', (req, res, next) => {
  res.render('about',{
		title: "소개 | 웹퍼블리셔 김신영",
		pageTitle: "소개",
		pageName: "about"
	});
});

module.exports = router;