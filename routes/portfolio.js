var express = require('express');
var router = express.Router();
var models = require('../models');

/* get portfolio */
router.get('/', (req, res, next)=>{
	models.Portfolio.fetchAll({withRelated:['tags']}).then(datas=>{
		res.render('portfolio',{
			title: "PORTFOLIO | 웹퍼블리셔 김신영",
			pageTitle : "PORTFOLIO",
			portfolios : datas.toJSON()
		});
	});
});

module.exports = router;