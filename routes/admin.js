var express = require('express');
var router = express.Router();
var config = require('../config');
var multer= require('multer');

router.get('/', (req, res, next)=>{
	res.render('admin/login',{
		title: "LOGIN | 웹퍼블리셔 김신영 ADMIN",
		pageTitle: "LOGIN"
	});
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
		title: "웹퍼블리셔 김신영 ADMIN",
		pageTitle: "main"
	});
});

router.get('/portfolio/write',(req,res)=>{
	res.render('admin/portfolio/write',{
		title:'쓰기',
		pageTitle:'hi'
	});
});

router.post('/portfolio/write',(req,res)=>{
	res.redirect('/portfolio/'+ 1);
});

router.post('/portfolio/upload',(req,res)=>{

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