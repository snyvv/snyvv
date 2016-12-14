var express = require('express');
var router = express.Router();
var models = require('../models');
var marked = require('marked');
marked.setOptions({
  renderer: new marked.Renderer(),
  breaks: true
});



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

router.get('/:id',(req,res,next)=>{
	models.Blog.where('id',req.params.id).fetch({withRelated:['tags','comments']}).then(datas=>{
		res.render('blog/view',{
			title: "블로그 | 웹퍼블리셔 김신영",
			pageTitle: "블로그",
			pageName: "blog",
			data: datas.toJSON()
		});
	});
});

router.post('/:id/comments',(req,res,next)=>{
	models.Comment.create({'comments':req.body.comments,'password':req.body.password,'name':req.body.name,'blog_id':req.params.id}).then(data=>{
		res.redirect('/blog/'+req.params.id);
	});
});

module.exports = router;