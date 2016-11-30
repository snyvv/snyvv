var express = require('express');
var router = express.Router();

/* get about */
router.get('/', (req, res, next) => {
  res.render('about',{
		title: "ABOUT | 웹퍼블리셔 김신영",
		pageTitle : "ABOUT"
	});
});

module.exports = router;