var express = require('express');
var router = express.Router();
var models = require('../models');

/* get portfolio */
router.get('/', (req, res, next)=>{
	models.Portfolio.fetchAll({withRelated:['tags']}).then(datas=>{
		res.render('portfolio',{
			title: "포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: "포트폴리오",
			pageName: "portfolio",
			portfolios: datas.toJSON()
		});
	});
});

router.get('/', (req, res, next)=>{
	res.render('portfolio_view',{
		title: "타이틀 + 포트폴리오 | 웹퍼블리셔 김신영",
		pageTitle: "타이틀",
		pageName: "portfolio"
	});
});

module.exports = router;