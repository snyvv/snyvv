var express = require('express');
var router = express.Router();
var models = require('../models');

/* get home */
router.get('/', (req, res, next)=>{
	models.Blog.fetchAll({withRelated:['tags']}).then(datas=>{
		res.render('blog/list',{
			title: "웹퍼블리셔 김신영",
			pageTitle: "블로그",
			pageName: "blog",
			menu: 4,
			blogs: datas.toJSON()
		});
	});
});

router.get('/:title',(req,res,next)=>{
	models.Blog.findOne({title:req.params.title}).then(data=>{
		res.render('blog/view',{
			title: "블로그 | 웹퍼블리셔 김신영",
			pageTitle: "블로그",
			pageName: "blog",
			data : data
		});
	});
});

module.exports = router;