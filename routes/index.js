var express = require('express');
var router = express.Router();

/* get home */
router.get('/', (req, res, next)=>{
	res.render('index',{
		title: "웹퍼블리셔 김신영",
		pageTitle : "HOME"
	});
});

module.exports = router;