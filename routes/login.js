var express = require('express');
var router = express.Router();

/* get home */
router.get('/', (req, res, next)=>{
	res.render('login',{
		title: "LOGIN | 웹퍼블리셔 김신영",
		pageTitle : "LOGIN"
	});
});

module.exports = router;