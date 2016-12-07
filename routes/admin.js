var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/', (req, res, next)=>{
	res.render('admin/login',{
		title: "LOGIN | 웹퍼블리셔 김신영 ADMIN",
		pageTitle: "LOGIN"
	});
});

router.post('/', (req, res, next)=>{
	var admin = {
		id: config.gmailID,
		//password: config.gamilPW
	}
	if(admin.id == req.body.id /*&& admin.password == req.body.password*/){
		res.redirect('main');
	}else{
		res.redirect('login?error=login');
	}
});

router.get('/main', (req, res, next)=>{
	res.render('admin/main',{
		title: "웹퍼블리셔 김신영 ADMIN",
		pageTitle: "main"
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