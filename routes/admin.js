var express = require('express');
var router = express.Router();
var config = require('../config');
var multer= require('multer');

router.get('/', (req, res, next)=>{
	if(req.session.admin){
		res.redirect('/admin/main');
	}else{
		res.render('admin/login',{
			title: "LOGIN | 웹퍼블리셔 김신영 ADMIN",
			pageTitle: "LOGIN"
		});
	}
});

router.post('/', (req, res, next)=>{
	var admin = {
		id: config.gmailID,
		password: config.gmailPW
	}
	if(admin.id == req.body.id && admin.password == req.body.password){
		req.session.admin = true;
		res.redirect('/admin/main');
	}else{
		res.redirect('/admin?error=login');
	}
});

router.use((req,res,next)=>{
	//TODO
	req.session.admin = true;
	if(req.session.admin)
		next();
	else {
		var err = new Error('ERROR');
  		err.status = 500;
  		next(err);
	}
});


router.get('/main', (req, res, next)=>{
	res.render('admin/main',{
		title: "ADMIN",
		pageTitle: "홈"
	});
});

router.get('/portfolio',(req,res)=>{
	res.render('admin/portfolio/list',{
		title:'포트폴리오 관리 | ADMIN',
		pageTitle:'포트폴리오 관리'
	});
});

router.get('/portfolio/write',(req,res)=>{
	res.render('admin/portfolio/write',{
		title:'포트폴리오 작성 | ADMIN',
		pageTitle:'포트폴리오 작성'
	});
});

router.get('/portfolio/modify',(req,res)=>{
	res.render('admin/portfolio/modify',{
		title:'포트폴리오 수정 | ADMIN',
		pageTitle:'포트폴리오 수정'
	});
});

router.post('/portfolio/write',(req,res)=>{
	res.redirect('/portfolio/'+ 1);
});

router.post('/portfolio/upload',(req,res)=>{

});

router.get('/blog',(req,res)=>{
	res.render('admin/blog/list',{
		title:'블로그 관리 | ADMIN',
		pageTitle:'블로그 관리'
	});
});

router.get('/blog/write',(req,res)=>{
	res.render('admin/blog/write',{
		title:'블로그 작성 | ADMIN',
		pageTitle:'블로그 작성'
	});
});

router.get('/blog/modify',(req,res)=>{
	res.render('admin/blog/modify',{
		title:'블로그 수정 | ADMIN',
		pageTitle:'블로그 수정'
	});
});

router.get('/comment',(req,res)=>{
	res.render('admin/comment',{
		title:'댓글 관리 | ADMIN',
		pageTitle:'댓글 관리'
	});
});

router.get('/contact',(req,res)=>{
	res.render('admin/contact',{
		title:'문의 관리 | ADMIN',
		pageTitle:'문의 관리'
	});
});


/* get login 
router.get('/', (req, res, next)=>{
	res.render('login',{
		title: "LOGIN | 웹퍼블리셔 김신영",
		pageTitle : "LOGIN"
	});
});*/

/* post login 
router.post('/', (req, res, next)=>{
	models.User.findOne({
		uid : req.body.uid,
		password : req.body.password
	},{require:true})
	.then(user=>{
		// login success
		req.session.user = user.toJSON();
		res.redirect('/');
	})
	.catch(err=>{
		console.log(err);
		res.redirect('/login?error=login');
	});
});*/

module.exports = router;