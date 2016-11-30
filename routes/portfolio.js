var express = require('express');
var router = express.Router();

/* get portfolio */
router.get('/', (req, res, next)=>{
  res.render('portfolio',{
		title: "PORTFOLIO | 웹퍼블리셔 김신영",
		pageTitle : "PORTFOLIO"
	});
});

module.exports = router;