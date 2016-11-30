var express = require('express');
var router = express.Router();
var models = require('../models');

/* get login */
router.get('/', (req, res, next)=>{
	res.render('login',{
		title: "LOGIN | 웹퍼블리셔 김신영",
		pageTitle : "LOGIN"
	});
});

/* post login */
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
});

module.exports = router;