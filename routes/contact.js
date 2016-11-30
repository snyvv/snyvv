var express = require('express');
var router = express.Router();

/* get contact */
router.get('/', (req, res, next)=>{
  res.render('contact',{
		title: "CONTACT | 웹퍼블리셔 김신영",
		pageTitle : "CONTACT"
	});
});

module.exports = router;
