var express = require('express');
var router = express.Router();
var models = require('../models');

/* get portfolio */
router.get('/', (req, res, next)=>{
	/*
	req.query.year
	req.query.tag
	req.query.keyword
	models.query('select * from portfolios where ')
	*/

	models.Portfolio.fetchAll({withRelated:['tags']}).then(datas=>{
		res.render('portfolio',{
			title: "포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: "포트폴리오",
			pageName: "portfolio",
			portfolios: datas.toJSON()
		});
	});
});

router.get('/:name',(req,res,next)=>{
	models.Portfolio.findOne({name:req.params.name}).then(data=>{
		res.render('portfolio_view',{
			title: req.params.name+" - 포트폴리오 | 웹퍼블리셔 김신영",
			pageTitle: "포트폴리오",
			pageName: "portfolio",
			data : data
		});
	});
});

module.exports = router;